import {PILOT_STORY} from "./pilot-story";
export type PilotProgress={scene:number;answers:Record<string,number>;completed:boolean;updatedAt:string};
const DB="sv-offline-pilot-v1",STORE="progress",KEY=PILOT_STORY.id;
export const EMPTY_PROGRESS:PilotProgress={scene:0,answers:{},completed:false,updatedAt:""};
function openDb():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
export async function loadPilotProgress():Promise<PilotProgress>{const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).get(KEY);req.onsuccess=()=>resolve(req.result??{...EMPTY_PROGRESS,answers:{}});req.onerror=()=>reject(req.error);tx.oncomplete=()=>db.close();});}
export async function savePilotProgress(progress:PilotProgress):Promise<void>{const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(progress,KEY);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
export function correctCount(progress:PilotProgress):number{return PILOT_STORY.scenes.reduce((sum,scene,si)=>sum+scene.questions.reduce((n,q,qi)=>n+(progress.answers[`${si}:${qi}`]===q.correct?1:0),0),0);}
