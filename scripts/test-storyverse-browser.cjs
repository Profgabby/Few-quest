// Development-only browser regression for the seven-scene GardenVerse reader.
// Install locally: npm install --no-save --package-lock=false playwright
// Install browser: npx playwright install chromium
// Run: STORYVERSE_BASE_URL=https://your-preview.example node scripts/test-storyverse-browser.cjs
// Never point this test at a production deployment.
const assert=require("node:assert/strict");
let chromium;
try{({chromium}=require("playwright"));}catch{console.error("Install Playwright locally: npm install --no-save --package-lock=false playwright && npx playwright install chromium");process.exit(2);}
const base=(process.env.STORYVERSE_BASE_URL||"http://localhost:3000").replace(/\/$/,"");
const slug="the-garden-beyond-the-boundary";
const url=base+"/en/storyverse/read/"+slug;
const guestKey="lifews.storyverse.guest.v1",shelfKey="lifews.storyverse.reading-shelf.v1";
const timeout=20000;
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext();
  const page=await context.newPage();
  await page.goto(url,{waitUntil:"domcontentloaded",timeout:30000});
  const story=page.getByRole("region",{name:"Interactive story"});
  await story.getByText("Scene 1 of 7").waitFor({timeout});
  await page.evaluate(([g,s])=>{localStorage.removeItem(g);localStorage.removeItem(s);},[guestKey,shelfKey]);
  await page.reload();await story.getByText("Scene 1 of 7").waitFor({timeout});
  const questions=story.getByRole("region",{name:"Reading questions"});
  for(let scene=1;scene<=7;scene++){
   await story.getByText("Scene "+scene+" of 7").waitFor({timeout});
   for(let q=1;q<=2;q++){
    await questions.getByText("Question "+q+" of 2").waitFor({timeout});
    const options=questions.getByRole("button",{name:/^[A-Z]\. /});
    assert.equal(await options.count(),3,"Each Master Storytellers question should have three options");
    // Select the first option (all 14 questions in this specific manuscript use index 0).
    await options.first().click();
    await questions.getByText(/Correct!/).waitFor({timeout});
    assert.equal(await options.first().isDisabled(),true,"First answer must lock the question");
    if(q===1)await questions.getByRole("button",{name:"Next question"}).click();
   }
   if(scene===2){
    await page.reload();await story.getByText("Scene 2 of 7").waitFor({timeout});
    // Question answers are session-only; the saved scene, not answers, must survive reload.
    await questions.getByText("Question 1 of 2").waitFor({timeout});
   }
   if(scene<7)await story.getByRole("button",{name:"Next scene"}).click();
  }
  await story.getByRole("button",{name:"Finish story"}).click();
  await story.getByText("You've finished the story!").waitFor({timeout});
  const completed=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),guestKey);
  assert.equal(completed.completedStories.filter(x=>x===slug).length,1,"Completion stored once");
  assert.equal(new Set(completed.correctChallenges).size,completed.correctChallenges.length,"No duplicate rewards");
  assert.equal(await page.evaluate(k=>Object.hasOwn(JSON.parse(localStorage.getItem(k)||"{}"),"the-garden-beyond-the-boundary"),shelfKey),false,"Completed story must leave reading shelf");
  const before=completed.correctChallenges.length;
  await story.getByRole("button",{name:"Read again"}).click();
  await story.getByText("Scene 1 of 7").waitFor({timeout});
  await questions.getByRole("button",{name:/^A\. /}).click();
  const replay=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),guestKey);
  assert.equal(replay.completedStories.filter(x=>x===slug).length,1,"Replay must not duplicate completion");
  assert.equal(replay.correctChallenges.length,before,"Replay must not duplicate question reward");
  await story.getByRole("button",{name:"Next scene"}).click();
  await story.getByRole("button",{name:"Previous scene"}).click();
  await story.getByText("Scene 1 of 7").waitFor({timeout});
  await story.getByRole("button",{name:"Just read"}).click();
  assert.equal(await questions.count(),0,"Read mode hides questions");
  await story.getByRole("button",{name:"Read and play"}).click();
  assert.equal(await questions.count(),1,"Play mode restores questions");
  console.log("PASS: 7 scenes, 14 questions, navigation, reload recovery, completion, restart, duplicate reward prevention, reading modes.");
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
