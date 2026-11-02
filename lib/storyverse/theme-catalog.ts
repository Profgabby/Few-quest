export const storyThemes=[
["garden","Garden Adventures"],["nature","Nature & Wildlife"],["water","Water & Rivers"],["food","Food & Nutrition"],["energy","Solar & Clean Energy"],["science","Science Discoveries"],["math","Mathematics Mysteries"],["culture","Culture & Traditions"],["family","Family & Friendship"],["school","School Life"],["environment","Environmental Heroes"],["health","Health & Wellbeing"],["technology","Technology & Inventions"],["space","Space & Exploration"],["history","History & Heritage"],["values","Ethics & Character"],["business","Entrepreneurship & Money"],["art","Art, Music & Creativity"],["sports","Sports & Teamwork"],["future","Future Worlds & Innovation"]
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
