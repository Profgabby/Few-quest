"use client";
import {useEffect,useState} from "react";
import {PILOT_STORY} from "@/lib/storyverse/pilot-story";
import {EMPTY_PROGRESS,loadPilotProgress,savePilotProgress,correctCount,type PilotProgress} from "@/lib/storyverse/pilot-storage";

export function OfflinePilot({locale}:{locale:string}){
 const [progress,setProgress]=useState<PilotProgress>({...EMPTY_PROGRESS,answers:{}});
 const [loaded,setLoaded]=useState(false);
 const [status,setStatus]=useState("Offline pack not downloaded");
 const [working,setWorking]=useState(false);
 useEffect(()=>{let active=true;loadPilotProgress().then(p=>{if(active){setProgress(p);setLoaded(true);}}).catch(()=>{if(active){setStatus("IndexedDB unavailable in this browser");setLoaded(true);}});
 if("serviceWorker" in navigator)navigator.serviceWorker.register("/sv-offline-pilot-sw.js",{scope:"/"}).catch(()=>setStatus("Service worker registration failed"));
 return()=>{active=false;};},[locale]);
 async function update(next:PilotProgress){try{await savePilotProgress(next);setProgress(next);}catch{setStatus("Saving failed; progress may not survive restart");}}
 async function download(){
  if(!("serviceWorker" in navigator)){setStatus("Offline downloads not supported in this browser");return;}
  setWorking(true);setStatus("Preparing offline pack…");
  try{
   const registration=await navigator.serviceWorker.register("/sv-offline-pilot-sw.js",{scope:"/"});
   const worker=registration.active??navigator.serviceWorker.controller;
   if(!worker)throw Error("Service worker not ready");
   const urls=[location.origin+location.pathname,...performance.getEntriesByType("resource").map(e=>e.name)].filter(url=>{try{const u=new URL(url);return u.origin===location.origin&&(u.pathname.startsWith("/_next/static/")||u.pathname.startsWith("/storyverse/images/")||u.pathname===location.pathname);}catch{return false;}});
   const result=await new Promise<{ok:boolean;count?:number;error?:string}>((resolve,reject)=>{const channel=new MessageChannel();const timeout=setTimeout(()=>reject(Error("Download timed out")),30000);channel.port1.onmessage=e=>{clearTimeout(timeout);resolve(e.data);};worker.postMessage({type:"SV_PILOT_DOWNLOAD",urls},[channel.port2]);});
   if(!result.ok)throw Error(result.error??"Download failed");
   setStatus(`Cache verified (${result.count} resources). Now disconnect and reload; offline operation is not yet proven.`);
  }catch(e){setStatus("Offline pack not ready: "+String(e));}finally{setWorking(false);}
 }
 if(!loaded)return <p>Loading locally saved reading progress…</p>;
 const scene=PILOT_STORY.scenes[progress.scene];
 const answered=Object.keys(progress.answers).length;
 return <section style={{display:"grid",gap:18}}>
 <p><strong>Development fixture:</strong> {PILOT_STORY.disclaimer} No subscriptions or rewards are issued.</p>
 <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
 <button type="button" disabled={working} onClick={download} style={{padding:"12px 18px",borderRadius:9,background:"#16563c",color:"white",border:0}}>{working?"Downloading…":"Save test story for offline reading"}</button>
 <span role="status" aria-live="polite">{status}</span>
 </div>
 <p>Scene {progress.scene+1} of 7 · {answered}/14 answered · {correctCount(progress)}/14 correct {progress.completed?"· Completed":""}</p>
 <article style={{background:"#fff",border:"1px solid #d5e0d9",borderRadius:14,padding:22,color:"#183d2d"}}>
 <h2>{scene.title}</h2><p style={{fontSize:18,lineHeight:1.7}}>{scene.body}</p>
 {scene.questions.map((q,qi)=><fieldset key={qi} style={{border:"1px solid #d6e4d9",borderRadius:10,marginBottom:14,padding:14}}>
 <legend style={{fontWeight:700}}>Question {progress.scene*2+qi+1}: {q.prompt}</legend>
 {q.options.map((option,oi)=><label key={oi} style={{display:"block",padding:7}}><input type="radio" name={`q-${progress.scene}-${qi}`} checked={progress.answers[`${progress.scene}:${qi}`]===oi} onChange={()=>update({...progress,answers:{...progress.answers,[`${progress.scene}:${qi}`]:oi},updatedAt:new Date().toISOString()})}/> {option}</label>)}
 {progress.answers[`${progress.scene}:${qi}`]!==undefined&&<small>{progress.answers[`${progress.scene}:${qi}`]===q.correct?"Correct answer":"Try again"}</small>}
 </fieldset>)}
 </article>
 <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
 <button type="button" disabled={progress.scene===0} onClick={()=>update({...progress,scene:progress.scene-1,updatedAt:new Date().toISOString()})}>Previous scene</button>
 <button type="button" disabled={progress.scene===6} onClick={()=>update({...progress,scene:progress.scene+1,updatedAt:new Date().toISOString()})}>Next scene</button>
 <button type="button" disabled={answered!==14||progress.completed} onClick={()=>update({...progress,completed:true,updatedAt:new Date().toISOString()})}>Mark story complete</button>
 </div>
 <p style={{fontSize:13,color:"#546d5b"}}>Progress is stored only in this browser's IndexedDB. Clearing site data removes it. This pilot does not synchronize between devices.</p>
 </section>;
}
