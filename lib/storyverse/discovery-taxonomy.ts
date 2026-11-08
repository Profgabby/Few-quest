import {storyThemes} from "./theme-catalog";
export const discoveryGroups=[
 {id:"nature",name:"Nature & Environment",description:"Plants, animals, water and the living world",categories:["garden","nature","water","environment","oceans","forests","animals","plants","climate"]},
 {id:"science",name:"Science & Technology",description:"Questions, experiments, engineering and invention",categories:["science","technology","space","engineering","robots","coding","inventions","watertech"]},
 {id:"family",name:"Family & Life",description:"Relationships, wellbeing and everyday experiences",categories:["family","school","health","sports","emotions","mindfulness","nutrition","food"]},
 {id:"culture",name:"Culture & Heritage",description:"History, language, traditions and creative expression",categories:["culture","history","languages","folklore","art","music","crafts","travel"]},
 {id:"adventure",name:"Adventure & Imagination",description:"Journeys, mysteries and imaginative worlds",categories:["adventure","mystery","fantasy","mythology","humor","geography","transport","poetry"]},
 {id:"learning",name:"Learning & Skills",description:"Numbers, practical skills and careers",categories:["math","business","money","careers","agriculture"]},
 {id:"community",name:"Community & Values",description:"Kindness, cooperation, inclusion and service",categories:["values","cities","leadership","peace","inclusion","citizenship","safety","accessibility","volunteering"]},
 {id:"future",name:"Future & Sustainability",description:"Energy, innovation and caring for tomorrow",categories:["energy","future","recycling","renewables","sustainability"]}
] as const;
export const storySubcategories:Record<string,string[]>={
 garden:["Planting & Growing","Soil & Water","Garden Creatures","Harvest Adventures","Garden Mysteries","Sustainable Gardening"],
 science:["Light & Shadows","Forces & Motion","Materials & Matter","Experiments","Scientific Discoveries"],
 family:["Family Traditions","Friendship & Kindness","Emotions & Understanding","Helping at Home","Celebrations"],
 culture:["Heritage & Traditions","Languages & Stories","Clothing & Crafts","Festivals","Cultural Exchange"],
 adventure:["Exploration & Journeys","Mysteries & Clues","Nature Adventures","Courage & Challenges","Team Adventures"]
};
export const categoryToGroup:Record<string,string>=Object.fromEntries(discoveryGroups.flatMap(g=>g.categories.map(c=>[c,g.id])));
export function validateDiscoveryGroups(){
 const actual=storyThemes.map(([id])=>id);
 const assigned=discoveryGroups.flatMap(g=>[...g.categories]);
 return {groups:discoveryGroups.length,categories:actual.length,uniqueAssignments:new Set(assigned).size,valid:assigned.length===actual.length&&new Set(assigned).size===actual.length&&actual.every(id=>assigned.includes(id))};
}
