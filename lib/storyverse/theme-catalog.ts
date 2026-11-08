export const storyThemes=[
["garden","Garden Adventures"],["nature","Nature & Wildlife"],["water","Water & Rivers"],["food","Food & Nutrition"],["energy","Solar & Clean Energy"],["science","Science Discoveries"],["math","Mathematics Mysteries"],["culture","Culture & Traditions"],["family","Family & Friendship"],["school","School Life"],["environment","Environmental Heroes"],["health","Health & Wellbeing"],["technology","Technology & Inventions"],["space","Space & Exploration"],["history","History & Heritage"],["values","Ethics & Character"],["business","Entrepreneurship & Money"],["art","Art, Music & Creativity"],["sports","Sports & Teamwork"],["future","Future Worlds & Innovation"],
["agriculture","Farming & Food Systems"],["climate","Climate & Weather"],["oceans","Oceans & Marine Life"],["forests","Forests & Biodiversity"],["animals","Animal Companions"],["plants","Plants & Botany"],["engineering","Engineering & Design"],["robots","Robotics & AI"],["coding","Coding & Digital Life"],["transport","Transport & Mobility"],
["cities","Cities & Communities"],["leadership","Leadership & Service"],["peace","Peace & Cooperation"],["inclusion","Inclusion & Belonging"],["languages","Languages & Communication"],["folklore","Folktales & Legends"],["mythology","Myths & Imagination"],["mystery","Mystery & Detective"],["fantasy","Fantasy & Magic"],["adventure","Adventure & Discovery"],
["humor","Humor & Everyday Life"],["poetry","Poetry & Expression"],["music","Music & Performance"],["crafts","Crafts & Making"],["money","Financial Literacy"],["careers","Careers & Work"],["citizenship","Citizenship & Responsibility"],["safety","Safety & Preparedness"],["emotions","Emotions & Resilience"],["mindfulness","Mindfulness & Reflection"],
["nutrition","Cooking & Healthy Meals"],["recycling","Recycling & Circular Economy"],["watertech","Water Technology"],["renewables","Renewable Energy Systems"],["inventions","Inventors & Discoveries"],["geography","Geography & Places"],["travel","Travel & World Cultures"],["accessibility","Accessibility & Universal Design"],["volunteering","Volunteering & Kindness"],["sustainability","Sustainable Futures"]
] as const;
export const tierNames=["Little Explorers","Story Adventurers","Master Storytellers"] as const;
// Working literary titles are intentionally distinct within each category.
// They are not editorially approved manuscripts or published books.
const motifs:Record<string,[string,string,string,string]>={
 garden:["the pumpkin patch","the watering can","the old greenhouse","the sunflower"],
 nature:["the woodland","the fox","the meadow","the sparrow"],
 water:["the riverbank","the little boat","the waterfall","the raincloud"],
 food:["the kitchen","the mango basket","the market stall","the picnic"],
 energy:["the rooftop","the sunbeam","the lantern","the windmill"],
 science:["the observatory","the magnifying glass","the moonstone","the laboratory"],
 math:["the clock tower","the number puzzle","the staircase","the measuring rope"],
 culture:["the village square","the woven cloth","the festival drum","the storyteller"],
 family:["the family table","grandmother's trunk","the front porch","the birthday cake"],
 school:["the classroom","the school bell","the library door","the playground"],
 environment:["the mangrove","the forest path","the river bend","the old oak"],
 health:["the garden walk","the red bicycle","the water bottle","the morning sun"],
 technology:["the workshop","the little robot","the radio","the blinking screen"],
 space:["the moon","the starship","the telescope","the comet"],
 history:["the old museum","the ancient letter","the monument","the forgotten diary"],
 values:["the village gate","the lost purse","the bridge","the promise"],
 business:["the market","the coin jar","the little shop","the ledger"],
 art:["the painting","the paintbrush","the gallery","the clay pot"],
 sports:["the football field","the running shoes","the finish line","the team bench"],
 future:["the sky garden","the silver city","the time capsule","the glowing tower"],
 agriculture:["the farm","the seed basket","the tractor","the harvest field"],
 climate:["the storm cloud","the weather vane","the mountain","the first snowfall"],
 oceans:["the coral reef","the lighthouse","the sea turtle","the tide pool"],
 forests:["the tall trees","the hidden clearing","the owl","the fallen log"],
 animals:["the puppy","the animal shelter","the kitten","the barn"],
 plants:["the orchid","the seedpod","the old tree","the wildflower"],
 engineering:["the bridge","the blueprint","the wooden wheel","the workshop"],
 robots:["the robot","the charging station","the copper hand","the workshop"],
 coding:["the computer","the secret message","the blinking cursor","the game"],
 transport:["the railway","the bicycle","the station","the ferry"],
 cities:["the city square","the corner shop","the bus stop","the apartment"],
 leadership:["the meeting hall","the team captain","the flag","the town square"],
 peace:["the village border","the olive branch","the meeting tree","the letter"],
 inclusion:["the classroom door","the new student","the playground","the friendship bench"],
 languages:["the dictionary","the whispered word","the letter","the storyteller"],
 folklore:["the moonlit village","the talking tortoise","the baobab tree","the drum"],
 mythology:["the mountain temple","the golden bird","the enchanted river","the oracle"],
 mystery:["the locked room","the missing key","the attic","the clock"],
 fantasy:["the enchanted forest","the silver dragon","the hidden kingdom","the spellbook"],
 adventure:["the mountain trail","the old map","the footbridge","the compass"],
 humor:["the upside-down house","the runaway hat","the birthday party","the goat"],
 poetry:["the notebook","the quiet window","the morning breeze","the ink bottle"],
 music:["the violin","the rehearsal room","the drum","the songbird"],
 crafts:["the sewing box","the weaving loom","the paper kite","the pottery wheel"],
 money:["the savings jar","the lost coin","the market","the treasure box"],
 careers:["the fire station","the baker","the workshop","the hospital"],
 citizenship:["the town hall","the ballot box","the community garden","the flag"],
 safety:["the crossroads","the flashlight","the storm shelter","the whistle"],
 emotions:["the rainy window","the friendship bracelet","the quiet room","the kite"],
 mindfulness:["the peaceful garden","the river stone","the morning bell","the cloud"],
 nutrition:["the cooking pot","the fruit basket","the kitchen garden","the lunchbox"],
 recycling:["the bottle","the repair shed","the old bicycle","the scrap pile"],
 watertech:["the water pump","the village well","the pipe","the reservoir"],
 renewables:["the solar panel","the wind turbine","the lantern","the sunny hill"],
 inventions:["the inventor's desk","the brass clock","the sketchbook","the strange machine"],
 geography:["the atlas","the mountain pass","the island","the valley"],
 travel:["the train ticket","the suitcase","the harbor","the mountain road"],
 accessibility:["the ramp","the library","the wheelchair","the playground"],
 volunteering:["the soup kitchen","the neighborhood","the helping hands","the community hall"],
 sustainability:["the green village","the sapling","the river","the rooftop garden"]
};
const literaryTitles=[
 (m:string[])=>`The Secret Beneath ${m[0]}`,
 (m:string[])=>`When ${m[1]} Went Missing`,
 (m:string[])=>`A Letter from ${m[2]}`,
 (m:string[])=>`The Day ${m[3]} Spoke`,
 (m:string[])=>`Who Left the Light at ${m[0]}?`,
 (m:string[])=>`The Night of ${m[1]}`,
 (m:string[])=>`The Whisper Behind ${m[2]}`,
 (m:string[])=>`A Promise by ${m[3]}`,
 (m:string[])=>`The Footprints Near ${m[0]}`,
 (m:string[])=>`The Curious Case of ${m[1]}`,
 (m:string[])=>`The Last Visitor to ${m[2]}`,
 (m:string[])=>`The Wish Hidden in ${m[3]}`,
 (m:string[])=>`What Happened at ${m[0]}?`,
 (m:string[])=>`The Trouble with ${m[1]}`,
 (m:string[])=>`The Little Mystery of ${m[2]}`,
 (m:string[])=>`The Gift Beside ${m[3]}`,
 (m:string[])=>`The Stranger at ${m[0]}`,
 (m:string[])=>`The Adventure of ${m[1]}`,
 (m:string[])=>`Seven Steps to ${m[2]}`,
 (m:string[])=>`The Other Side of ${m[3]}`,
 (m:string[])=>`The Message from ${m[0]}`,
 (m:string[])=>`The Puzzle of ${m[1]}`,
 (m:string[])=>`The Door Beyond ${m[2]}`,
 (m:string[])=>`The Secret Life of ${m[3]}`,
 (m:string[])=>`The Morning ${m[0]} Changed`,
 (m:string[])=>`The Shadow of ${m[1]}`,
 (m:string[])=>`The Map to ${m[2]}`,
 (m:string[])=>`The Song of ${m[3]}`,
 (m:string[])=>`The Courage to Cross ${m[0]}`,
 (m:string[])=>`The Mystery Under ${m[1]}`,
 (m:string[])=>`The Keeper of ${m[2]}`,
 (m:string[])=>`The Rainy Afternoon at ${m[3]}`,
 (m:string[])=>`The Forgotten Key to ${m[0]}`,
 (m:string[])=>`The Unexpected Guest at ${m[1]}`,
 (m:string[])=>`The Secret Path Past ${m[2]}`,
 (m:string[])=>`The Day We Found ${m[3]}`,
 (m:string[])=>`The Riddle of ${m[0]}`,
 (m:string[])=>`The Midnight Call from ${m[1]}`,
 (m:string[])=>`The Long Road to ${m[2]}`,
 (m:string[])=>`The Treasure Inside ${m[3]}`,
 (m:string[])=>`The Friend We Met at ${m[0]}`,
 (m:string[])=>`The Strange Sound Near ${m[1]}`,
 (m:string[])=>`The Promise We Made at ${m[2]}`,
 (m:string[])=>`The Mystery of the Missing ${m[3]}`,
 (m:string[])=>`The Great Escape from ${m[0]}`,
 (m:string[])=>`The Unexpected Hero of ${m[1]}`,
 (m:string[])=>`The Secret Written on ${m[2]}`,
 (m:string[])=>`The Journey Past ${m[3]}`,
 (m:string[])=>`The Last Light at ${m[0]}`,
 (m:string[])=>`The Story Nobody Told About ${m[1]}`
];
export type ThemeTier=1|2|3;
export type StoryConcept={id:string;themeId:string;theme:string;tier:ThemeTier;tierName:string;title:string;status:"concept";summary:string};
export const storyConcepts:StoryConcept[]=storyThemes.flatMap(([themeId,theme])=>literaryTitles.map((makeTitle,index)=>{
 const tier=(index<17?1:index<34?2:3) as ThemeTier;
 return {id:`SV-${themeId.toUpperCase()}-${String(index+1).padStart(2,"0")}`,themeId,theme,tier,tierName:tierNames[tier-1],title:makeTitle(motifs[themeId]??[theme.toLowerCase(),"the village","the hill","the road"]),status:"concept" as const,summary:`A ${tierNames[tier-1].toLowerCase()} story concept exploring ${theme.toLowerCase()} through an original character-led adventure.`};
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
