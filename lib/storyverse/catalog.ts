import manuscript1 from "../../the-little-seed-that-would-not-wake/story.json";
import manuscript2 from "../../mimi-and-the-missing-watering-can/story.json";
import manuscript3 from "../../the-sunflower-that-followed-the-sun/story.json";
import manuscript4 from "../../tobi-and-the-tiny-garden-visitor/story.json";
import manuscript5 from "../../the-pumpkin-that-grew-too-big/story.json";
export type StoryChoice = { label: string; correct: boolean; feedback: string };
export type StoryQuestion = { question: string; choices: StoryChoice[] };
export type StoryScene = { heading: string; body: string; question: string; choices: StoryChoice[]; questions?: StoryQuestion[]; illustrationAlt?: string };
export type StoryLevel = 1 | 2 | 3;
export type Story = { levelNumber: StoryLevel; slug: string; title: string; level: string; world: string; gardenCode?: string; description: string; scenes: StoryScene[] };

// Editorial demo content only; not approved as a published translation or scientific module.
export const stories: Story[] = [
  {levelNumber:1,slug: 'little-seed', title: 'The Little Seed That Would Not Wake', level: 'Little Explorers', world:'GardenVerse', gardenCode:'GM-N01', description:'A picture-led discovery about a seed and what plants need.', scenes:[
    {heading:'A Tiny Seed',body:'Ada found a little seed. She placed it gently in the garden soil.',question:'What did Ada plant?',choices:[{label:'A seed',correct:true,feedback:'Yes! A seed can grow into a plant when conditions are suitable.'},{label:'A stone',correct:false,feedback:'A stone is not a seed. Try again.'}]},
    {heading:'Checking the Soil',body:'Ada noticed that the surface of the soil felt dry. She checked before watering.',question:'What did Ada check?',choices:[{label:'The soil',correct:true,feedback:'Correct. Checking the soil helps us decide whether water is needed.'},{label:'The gate',correct:false,feedback:'Try looking at what Ada touched.'}]},
    {heading:'The Little Sprout',body:'After some days, Ada saw a tiny green shoot above the soil.',question:'What appeared above the soil?',choices:[{label:'A green shoot',correct:true,feedback:'Correct! The young plant is emerging.'},{label:'A pencil',correct:false,feedback:'Try again.'}]}
  ]},
  {levelNumber:2,slug:'missing-watering-can',title:'The Missing Watering Can',level:'Story Adventurers',world:'AdventureVerse',description:'Solve a garden mystery through careful observation and cooperation.',scenes:[{heading:'Something Is Missing',body:'The class arrived to tend the garden, but the watering can was not in its usual place. They began by checking the tool shelf.',question:'What is the most useful first step?',choices:[{label:'Look for evidence',correct:true,feedback:'Good investigation starts with observations.'},{label:'Blame a classmate',correct:false,feedback:'An accusation without evidence is not a fair investigation.'}]}]},
  {levelNumber:3,slug:'water-challenge',title:'The Great Garden Water Challenge',level:'Master Storytellers',world:'ScienceVerse',gardenCode:'GM-S02',description:'Explore how students can compare irrigation approaches fairly.',scenes:[{heading:'Two Garden Beds',body:'Students want to compare irrigation methods. They consider crop type, initial soil conditions, and the volume of applied water.',question:'What makes the comparison more reliable?',choices:[{label:'Keep other conditions as similar as practical',correct:true,feedback:'Yes. Controlled conditions and repeated measurements improve the comparison.'},{label:'Use different crops and ignore initial conditions',correct:false,feedback:'Multiple uncontrolled differences make attribution difficult.'}]}]}
];

// Uploaded editorial drafts are available in the preview reader, but are not publicly approved publications.
const gardenManuscripts = [manuscript1,manuscript2,manuscript3,manuscript4,manuscript5];
for (const manuscript of gardenManuscripts) {
 const scenes: StoryScene[] = manuscript.chapters.map(chapter => {
  const questions: StoryQuestion[] = chapter.questions.map(q => ({question:q.prompt,choices:q.options.map((label,i)=>({label,correct:i===q.correctOption,feedback:i===q.correctOption?q.feedback:'Try again. Think about what happened in the story.'}))}));
  return {heading:chapter.title,body:chapter.content.map(p=>p.text).join('\n\n'),question:questions[0].question,choices:questions[0].choices,questions,illustrationAlt:chapter.illustrations[0]?.alt};
 });
 const story: Story = {levelNumber:1,slug:manuscript.slug,title:manuscript.title,level:'Little Explorers',world:'GardenVerse',description:`Seven-scene English editorial preview: ${manuscript.title}`,scenes};
 const existing=stories.findIndex(s=>s.slug===story.slug);
 if(existing>=0) stories[existing]=story; else stories.push(story);
}
