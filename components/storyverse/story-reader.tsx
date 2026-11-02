"use client";
import {useState} from "react";
import {loadGuest,saveGuest} from "@/lib/storyverse/guest-progress";
import type {Story} from "@/lib/storyverse/catalog";
export function StoryReader({story}:{story:Story}){
 const [index,setIndex]=useState(0);
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const selected=answers[index]??null;
 const [mode,setMode]=useState<"read"|"play">("read");
 const [awarded,setAwarded]=useState<string[]>([]);
 const [finished,setFinished]=useState(false);
 const scene=story.scenes[index];
 const points=awarded.filter(x=>x.startsWith("challenge:")).length*5+(awarded.includes("complete")?20:0);
 const badges=[...(awarded.includes("complete")?["First Story"]:[]),...(awarded.filter(x=>x.startsWith("challenge:")).length>=3?["Curious Explorer"]:[])];
 function award(key:string){setAwarded(a=>a.includes(key)?a:[...a,key]);const guest=loadGuest();if(key==="complete"&&!guest.completedStories.includes(story.slug)){saveGuest({...guest,completedStories:[...guest.completedStories,story.slug]});}if(key.startsWith("challenge:")){const id=`${story.slug}:${key}`;if(!guest.correctChallenges.includes(id))saveGuest({...guest,correctChallenges:[...guest.correctChallenges,id]});}}
 function next(){if(index===story.scenes.length-1){setFinished(true);award("complete");}else{setIndex(i=>i+1);}}
 function answer(i:number){if(answers[index]!==undefined)return;setAnswers(a=>({...a,[index]:i}));if(scene.choices[i].correct)award(`challenge:${index}`);}
 return <section aria-label="Interactive story" style={{border:"1px solid #dce6df",borderRadius:18,padding:24,background:"white",display:"grid",gap:16}}>
 <div style={{display:"flex",gap:12,justifyContent:"space-between",flexWrap:"wrap"}}><span>{finished?"Finished":`Scene ${index+1} of ${story.scenes.length}`}</span><strong aria-live="polite">{points} StoryPoints · {badges.length} badges</strong></div>
 <progress value={finished?story.scenes.length:index+1} max={story.scenes.length} aria-label="Reading progress" style={{width:"100%",accentColor:"#006B3C"}} />
 <div role="group" aria-label="Reading mode" style={{display:"flex",gap:12,flexWrap:"wrap"}}><button type="button" aria-pressed={mode==="read"} onClick={()=>setMode("read")}>Just read</button><button type="button" aria-pressed={mode==="play"} onClick={()=>setMode("play")}>Read and play</button></div>
 {finished?<div role="status" style={{background:"#e8f1e9",padding:24,borderRadius:12}}><h2>Story completed!</h2><p>This reading session included {points} potential StoryPoints. Previously completed stories and challenges do not earn duplicate saved points.</p><p>Badges: {badges.length?badges.join(", "):"Keep exploring!"}</p><button type="button" onClick={()=>{setIndex(0);setFinished(false)}}>Read again</button><p><small>Guest progress is saved only in this browser on this device. No account rewards or FEW Quest competition scores are affected.</small></p></div>:<>
 <div style={{background:"#e8f1e9",padding:22,borderRadius:12}}><h2>{scene.heading}</h2><p style={{fontSize:"1.15rem",lineHeight:1.7}}>{scene.body}</p></div>
 {mode==="play"&&<><h3>{scene.question}</h3><div style={{display:"grid",gap:10}}>{scene.choices.map((choice,i)=><button key={i} type="button" aria-pressed={selected===i} disabled={selected!==null} onClick={()=>answer(i)} style={{textAlign:"start",padding:15,borderRadius:12,border:selected===i?"2px solid #006B3C":"1px solid #b6c6bc",background:selected===i?"#e8f1e9":"white",cursor:"pointer",fontSize:16}}>{choice.label}</button>)}</div>{selected!==null&&<p role="status">{scene.choices[selected].feedback}</p>}<p><small>Questions are optional. Only your first answer counts; you may continue without answering.</small></p></>}
 <div style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}><button type="button" disabled={index===0} onClick={()=>{setIndex(i=>i-1)}}>Previous scene</button><button type="button" onClick={next}>{index===story.scenes.length-1?"Finish story":"Next scene"}</button></div></>}
 <small>Prototype: English editorial samples only; no approved audio or translations. Guest rewards are local to this browser and do not affect FEW Quest competitions. Re-reading does not duplicate saved points.</small>
 </section>;
}
