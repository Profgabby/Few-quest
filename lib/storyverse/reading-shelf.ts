// Browser-local reading positions. Separate from the existing guest reward schema.
export const READING_SHELF_KEY="lifews.storyverse.reading-shelf.v1";
export type ReadingPosition={scene:number;updatedAt:number};
export type ReadingShelf=Record<string,ReadingPosition>;
export function loadReadingShelf():ReadingShelf{
 if(typeof window==="undefined")return {};
 try{
  const raw=JSON.parse(window.localStorage.getItem(READING_SHELF_KEY)||"{}");
  if(!raw||typeof raw!=="object"||Array.isArray(raw))return {};
  const shelf:ReadingShelf={};
  for(const [slug,value] of Object.entries(raw)){
   if(!/^[a-z0-9-]+$/.test(slug)||!value||typeof value!=="object")continue;
   const v=value as Partial<ReadingPosition>;
   if(Number.isInteger(v.scene)&&typeof v.scene==="number"&&v.scene>=0&&v.scene<10000&&typeof v.updatedAt==="number"&&Number.isFinite(v.updatedAt))shelf[slug]={scene:v.scene,updatedAt:v.updatedAt};
  }
  return shelf;
 }catch{return {};}
}
export function saveReadingPosition(slug:string,scene:number){
 if(typeof window==="undefined"||!/^[a-z0-9-]+$/.test(slug)||!Number.isInteger(scene)||scene<0)return false;
 try{
  const shelf=loadReadingShelf();
  shelf[slug]={scene,updatedAt:Date.now()};
  window.localStorage.setItem(READING_SHELF_KEY,JSON.stringify(shelf));
  window.dispatchEvent(new Event("storyverse-reading-shelf"));
  return true;
 }catch{return false;}
}
export function clearReadingPosition(slug:string){
 if(typeof window==="undefined")return;
 try{const shelf=loadReadingShelf();delete shelf[slug];window.localStorage.setItem(READING_SHELF_KEY,JSON.stringify(shelf));window.dispatchEvent(new Event("storyverse-reading-shelf"));}catch{}
}
