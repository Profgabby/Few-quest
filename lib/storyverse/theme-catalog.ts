export const storyThemes=[
["garden","Garden Adventures"],["nature","Nature & Wildlife"],["water","Water & Rivers"],["food","Food & Nutrition"],["energy","Solar & Clean Energy"],["science","Science Discoveries"],["math","Mathematics Mysteries"],["culture","Culture & Traditions"],["family","Family & Friendship"],["school","School Life"],["environment","Environmental Heroes"],["health","Health & Wellbeing"],["technology","Technology & Inventions"],["space","Space & Exploration"],["history","History & Heritage"],["values","Ethics & Character"],["business","Entrepreneurship & Money"],["art","Art, Music & Creativity"],["sports","Sports & Teamwork"],["future","Future Worlds & Innovation"],
["agriculture","Farming & Food Systems"],["climate","Climate & Weather"],["oceans","Oceans & Marine Life"],["forests","Forests & Biodiversity"],["animals","Animal Companions"],["plants","Plants & Botany"],["engineering","Engineering & Design"],["robots","Robotics & AI"],["coding","Coding & Digital Life"],["transport","Transport & Mobility"],
["cities","Cities & Communities"],["leadership","Leadership & Service"],["peace","Peace & Cooperation"],["inclusion","Inclusion & Belonging"],["languages","Languages & Communication"],["folklore","Folktales & Legends"],["mythology","Myths & Imagination"],["mystery","Mystery & Detective"],["fantasy","Fantasy & Magic"],["adventure","Adventure & Discovery"],
["humor","Humor & Everyday Life"],["poetry","Poetry & Expression"],["music","Music & Performance"],["crafts","Crafts & Making"],["money","Financial Literacy"],["careers","Careers & Work"],["citizenship","Citizenship & Responsibility"],["safety","Safety & Preparedness"],["emotions","Emotions & Resilience"],["mindfulness","Mindfulness & Reflection"],
["nutrition","Cooking & Healthy Meals"],["recycling","Recycling & Circular Economy"],["watertech","Water Technology"],["renewables","Renewable Energy Systems"],["inventions","Inventors & Discoveries"],["geography","Geography & Places"],["travel","Travel & World Cultures"],["accessibility","Accessibility & Universal Design"],["volunteering","Volunteering & Kindness"],["sustainability","Sustainable Futures"]
] as const;
export const tierNames=["Little Explorers","Story Adventurers","Master Storytellers"] as const;
const prompts=[
"The First Discovery","A Surprising Visitor","The Missing Clue","The Helpful Neighbor","A Small Beginning",
"The Day Everything Changed","The Hidden Path","The Great Question","A New Friend","The Curious Team",
"The Secret Notebook","An Unexpected Challenge","The Big Decision","A Promise to Keep","The Clever Solution",
"The Mystery at Sunrise","The Community Project","The Lost Map","The Careful Experiment","A Journey Together",
"The Unusual Gift","The Problem Solvers","The Special Invitation","A Lesson from Nature","The Festival Challenge",
"The Brave Idea","The Mysterious Sound","A Plan for Tomorrow","The Difficult Choice","The New Discovery",
"The Helpful Machine","The Rainy-Day Mission","The Forgotten Story","The Great Investigation","The Teamwork Test",
"The Wonderful Surprise","The Puzzle Nobody Solved","A Change of Plans","The Discovery Journal","The Shared Treasure",
"The Challenge at Home","The Courage to Ask","A Better Way","The Journey Beyond","The Unexpected Helper",
"The Community Mystery","The Last Piece","The Big Experiment","A Future Worth Building","The Story We Share"
] as const;
export type ThemeTier=1|2|3;
export type StoryConcept={id:string;themeId:string;theme:string;tier:ThemeTier;tierName:string;title:string;status:"concept";summary:string};
export const storyConcepts:StoryConcept[]=storyThemes.flatMap(([themeId,theme])=>prompts.map((prompt,index)=>{
 const tier=(index<17?1:index<34?2:3) as ThemeTier;
 return {id:`SV-${themeId.toUpperCase()}-${String(index+1).padStart(2,"0")}`,themeId,theme,tier,tierName:tierNames[tier-1],title:`${theme}: ${prompt}`,status:"concept" as const,summary:`A ${tierNames[tier-1].toLowerCase()} story concept exploring ${theme.toLowerCase()} through ${prompt.toLowerCase()}.`};
}));

/** Roadmap capacity: 60 categories x 200 original manuscripts = 12,000 stories. */
export const STORY_COLLECTION_TARGET=12000;
export const TARGET_STORIES_PER_THEME=200;
export const INITIAL_CONCEPTS_PER_THEME=50;

export const TARGET_PER_TIER={1:70,2:70,3:60} as const;
export const storyCollectionPlan=storyThemes.map(([themeId,theme])=>({
 themeId,theme,target:TARGET_STORIES_PER_THEME,
 tierTargets:[{tier:1 as const,count:TARGET_PER_TIER[1]},{tier:2 as const,count:TARGET_PER_TIER[2]},{tier:3 as const,count:TARGET_PER_TIER[3]}],
 seededConcepts:storyConcepts.filter(c=>c.themeId===themeId).length,
 publishedCount:0 // Roadmap-only count; do not infer publication from this plan.
}));
export function validateStoryCollectionPlan(){
 const ids=new Set(storyConcepts.map(c=>c.id));
 return {themes:storyThemes.length,seededConcepts:storyConcepts.length,uniqueConceptIds:ids.size,
 target:storyCollectionPlan.reduce((sum,c)=>sum+c.target,0),
 consistent:storyThemes.length===60&&storyConcepts.length===3000&&ids.size===storyConcepts.length&&storyCollectionPlan.every(c=>c.seededConcepts===50&&c.tierTargets.reduce((n,t)=>n+t.count,0)===c.target)};
}
