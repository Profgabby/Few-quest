export const STORAGE_KEY = "lifews.storyverse.guest.v1";
export type GuestProgress = { version:1; completedStories:string[]; correctChallenges:string[]; level:1|2|3; };
export const emptyProgress:GuestProgress={version:1,completedStories:[],correctChallenges:[],level:1};
export function loadGuest():GuestProgress {
 if(typeof window==="undefined")return {...emptyProgress};
 try {const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
 if(data?.version!==1||!Array.isArray(data.completedStories)||!Array.isArray(data.correctChallenges)||![1,2,3].includes(data.level))return {...emptyProgress};
 return {version:1,completedStories:[...new Set<string>(data.completedStories.filter((x:unknown):x is string=>typeof x==="string"))],correctChallenges:[...new Set<string>(data.correctChallenges.filter((x:unknown):x is string=>typeof x==="string"))],level:data.level};
 }catch{return {...emptyProgress};}
}
export function saveGuest(data:GuestProgress):boolean{if(typeof window!=="undefined"){try {localStorage.setItem(STORAGE_KEY,JSON.stringify(data));window.dispatchEvent(new Event("storyverse-progress"));return true;} catch {return false;}}return false;}
export function storyPoints(data:GuestProgress){return new Set(data.completedStories).size*20+new Set(data.correctChallenges).size*5;}
export function guestBadges(data:GuestProgress){return [ ...(data.completedStories.length>=1?["First Story"]:[]),...(data.completedStories.length>=3?["Story Explorer"]:[]),...(data.correctChallenges.length>=3?["Curious Explorer"]:[]) ];}
