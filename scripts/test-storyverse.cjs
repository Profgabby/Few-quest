// Structural regression checks for all 15 GardenVerse editorial manuscripts.
// Run: npm run test:storyverse
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const catalog = fs.readFileSync(path.join(root,"lib/storyverse/catalog.ts"),"utf8");
const tiers = [
 {dir:".",tier:1,files:["the-little-seed-that-would-not-wake","mimi-and-the-missing-watering-can","the-sunflower-that-followed-the-sun","tobi-and-the-tiny-garden-visitor","the-pumpkin-that-grew-too-big"],name:"Little Explorers"},
 {dir:"content/storyverse/gardenverse",tier:2,files:["the-secret-behind-the-garden-gate","ada-and-the-midnight-garden-mystery","the-day-the-river-stopped-flowing","the-hidden-treasure-of-mango-hill","the-children-who-saved-the-orchard"],name:"Story Adventurers"},
 {dir:"content/storyverse/gardenverse",tier:3,files:["beneath-the-roots-of-yesterday","the-last-harvest-of-willow-creek","secrets-of-the-forgotten-greenhouse","when-the-rains-refused-to-come","the-garden-beyond-the-boundary"],name:"Master Storytellers"}
];
const slugs = new Set(), ids = new Set();
let scenes=0, questions=0;
for(const tier of tiers){
 for(const slug of tier.files){
  const full=tier.tier===1?path.join(root,slug,"story.json"):path.join(root,tier.dir,slug+".json");
  const data=JSON.parse(fs.readFileSync(full,"utf8"));
  assert.equal(data.slug,slug,slug+" slug mismatch");
  assert.equal(data.readingTier,tier.tier,slug+" tier mismatch");
  assert.equal(data.readingTierName,tier.name,slug+" tier name mismatch");
  assert.equal(data.chapters.length,7,slug+" must have seven scenes");
  assert.equal(data.editorialStatus,"draft_review_required");
  assert.equal(data.publication.approved,false);
  assert.equal(data.publication.publiclyListed,false);
  assert(!slugs.has(slug),"Duplicate slug: "+slug);slugs.add(slug);
  assert(!ids.has(data.storyId),"Duplicate story ID: "+data.storyId);ids.add(data.storyId);
  assert(catalog.includes(JSON.stringify(slug+".json"))||catalog.includes(JSON.stringify(slug+"/story.json")),"Catalog import missing for "+slug);
  for(let i=0;i<7;i++){
   const chapter=data.chapters[i],n=String(i+1).padStart(2,"0");
   assert.equal(chapter.id,"scene-"+n,slug+" scene ID");
   assert(chapter.content.some(p=>typeof p.text==="string"&&p.text.trim().length>0),slug+" empty scene");
   assert.equal(chapter.questions.length,2,slug+" question count");
   assert.equal(chapter.navigation.previous,i?"scene-"+String(i).padStart(2,"0"):null);
   assert.equal(chapter.navigation.next,i<6?"scene-"+String(i+2).padStart(2,"0"):null);
   for(const q of chapter.questions){
    assert(typeof q.prompt==="string"&&q.prompt.trim(),slug+" empty question");
    assert(Array.isArray(q.options)&&q.options.length>=2,slug+" options");
    assert(Number.isInteger(q.correctOption)&&q.correctOption>=0&&q.correctOption<q.options.length,slug+" answer index");
    assert(typeof q.feedback==="string"&&q.feedback.trim(),slug+" missing feedback");
    questions++;
   }
   scenes++;
  }
  process.stdout.write("PASS "+slug+"\n");
 }
}
assert.equal(slugs.size,15);assert.equal(scenes,105);assert.equal(questions,210);
console.log("PASS: "+slugs.size+" books, "+scenes+" scenes, "+questions+" questions.");
