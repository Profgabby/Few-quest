"use client";
import {useEffect,useState} from "react";
import {loadReadingShelf,saveReadingPosition,clearReadingPosition} from "@/lib/storyverse/reading-shelf";
import {loadGuest,saveGuest} from "@/lib/storyverse/guest-progress";
import type {Story} from "@/lib/storyverse/catalog";

const green="#145438";
const buttonBase:React.CSSProperties={padding:"12px 18px",borderRadius:12,fontSize:16,fontWeight:650,cursor:"pointer",border:"1px solid #9cb7a6",background:"#fff",color:green};
export function StoryReader({story}:{story:Story}){
 const [index,setIndex]=useState(0);
 const [restored,setRestored]=useState(false);
 useEffect(()=>{const shelf=loadReadingShelf();const scene=shelf[story.slug]?.scene??0;setIndex(Math.min(Math.max(0,scene),story.scenes.length-1));setRestored(true);},[story.slug,story.scenes.length]);
 const [answers,setAnswers]=useState<Record<string,number>>({});
 const [questionIndex,setQuestionIndex]=useState(0);
 const [mode,setMode]=useState<"read"|"play">("play");
 const [awarded,setAwarded]=useState<string[]>([]);
 const [finished,setFinished]=useState(false);
 const scene=story.scenes[index];
 const questions=scene.questions??[{question:scene.question,choices:scene.choices}];
 const currentQuestion=questions[questionIndex];
 const selected=answers[`${index}:${questionIndex}`]??null;
 const correctCount=awarded.filter(x=>x.startsWith("challenge:")).length;
 const points=correctCount*5+(awarded.includes("complete")?20:0);
 const badges=[...(awarded.includes("complete")?["First Story"]:[]),...(correctCount>=3?["Curious Explorer"]:[])];
 function award(key:string){
  if(awarded.includes(key))return;
  setAwarded(a=>a.includes(key)?a:[...a,key]);
  const guest=loadGuest();
  if(key==="complete"&&!guest.completedStories.includes(story.slug))saveGuest({...guest,completedStories:[...guest.completedStories,story.slug]});
  if(key.startsWith("challenge:")){
   const id=`${story.slug}:${key}`;
   if(!guest.correctChallenges.includes(id))saveGuest({...guest,correctChallenges:[...guest.correctChallenges,id]});
  }
 }
 function next(){
  if(index===story.scenes.length-1){setFinished(true);clearReadingPosition(story.slug);award("complete");}
  else {saveReadingPosition(story.slug,index+1);setIndex(i=>i+1);setQuestionIndex(0);}
 }
 function answer(i:number){
  const key=`${index}:${questionIndex}`;
  if(answers[key]!==undefined)return;
  setAnswers(a=>({...a,[key]:i}));
  if(currentQuestion.choices[i].correct)award(`challenge:${index}:${questionIndex}`);
 }
 function restart(){saveReadingPosition(story.slug,0);setIndex(0);setQuestionIndex(0);setFinished(false);setAnswers({});setAwarded([]);}
 return <section aria-label="Interactive story" style={{maxWidth:960,margin:"0 auto",border:"1px solid #dce6df",borderRadius:22,padding:"clamp(16px,4vw,36px)",background:"#fff",display:"grid",gap:20}}>
  {!restored&&<p role="status">Loading saved reading position…</p>}
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
   <div><span style={{fontWeight:750,color:green}}>{story.world} · {story.level}</span><p style={{margin:"5px 0 0",color:"#52685a"}}>{finished?"Story completed":`Scene ${index+1} of ${story.scenes.length}`}</p></div>
   <span aria-live="polite" style={{background:"#f3f4e5",color:"#4c4927",padding:"9px 13px",borderRadius:20,fontWeight:700}}>{points} session points · {badges.length} session badges</span>
  </div>
  <progress value={finished?story.scenes.length:index+1} max={story.scenes.length} aria-label="Reading progress" style={{width:"100%",height:12,accentColor:green}} />
  <div role="group" aria-label="Reading mode" style={{display:"flex",gap:10,flexWrap:"wrap"}}>
   {(["read","play"] as const).map(value=><button key={value} type="button" aria-pressed={mode===value} onClick={()=>setMode(value)} style={{...buttonBase,background:mode===value?green:"#fff",color:mode===value?"#fff":green}}>{value==="read"?"Just read":"Read and play"}</button>)}
  </div>
  {finished?<div role="status" style={{background:"#e9f2e9",padding:28,borderRadius:16}}>
   <h2>You've finished the story!</h2><p>You answered {correctCount} questions correctly during this reading session.</p><p>Session points: {points}. Session badges: {badges.length?badges.join(", "):"None yet"}.</p>
   <button type="button" onClick={restart} style={{...buttonBase,background:green,color:"#fff"}}>Read again</button>
   <p style={{fontSize:13}}>Previously saved guest rewards are not awarded again. This session summary is not your lifetime points balance.</p>
  </div>:<>
   <article style={{background:"#f5f8ef",padding:"clamp(18px,4vw,36px)",borderRadius:18}}>
    <div role="img" aria-label={scene.illustrationAlt??`Illustration planned for ${scene.heading}`} style={{border:"1px dashed #b2c7b5",borderRadius:14,minHeight:95,display:"grid",placeItems:"center",marginBottom:24,color:"#56715e",fontSize:14}}>Illustration in development</div>
    <p style={{color:"#6c6b38",fontWeight:750,letterSpacing:1,fontSize:13,textTransform:"uppercase"}}>Chapter {index+1}</p>
    <h2 style={{fontSize:"clamp(25px,3vw,36px)",color:"#153e2c",margin:"8px 0 18px"}}>{scene.heading}</h2>
    {scene.body.split("\n\n").map((paragraph,i)=><p key={i} style={{fontSize:"clamp(18px,2vw,21px)",lineHeight:1.85,color:"#233b30",margin:"0 0 15px"}}>{paragraph}</p>)}
   </article>
   {mode==="play"&&<section aria-label="Reading questions" style={{border:"1px solid #d9e7dc",borderRadius:16,padding:"clamp(16px,3vw,26px)",display:"grid",gap:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}><strong style={{color:green}}>Think about the story</strong><span style={{color:"#52685a"}}>Question {questionIndex+1} of {questions.length}</span></div>
    <h3 style={{fontSize:21,margin:0}}>{currentQuestion.question}</h3>
    <div style={{display:"grid",gap:10}}>{currentQuestion.choices.map((choice,i)=><button key={i} type="button" aria-pressed={selected===i} disabled={selected!==null} onClick={()=>answer(i)} style={{...buttonBase,textAlign:"left",width:"100%",background:selected===i?"#e0f0e4":"#fff",border:selected===i?"2px solid #145438":"1px solid #b6c6bc",opacity:selected!==null&&selected!==i?.65:1,cursor:selected!==null?"default":"pointer"}}>{String.fromCharCode(65+i)}. {choice.label}</button>)}</div>
    {selected!==null&&<p role="status" style={{padding:12,borderRadius:10,background:currentQuestion.choices[selected].correct?"#e1f2e5":"#fff2dd",margin:0}}>{currentQuestion.choices[selected].correct?"Correct! ":"Not quite. "}{currentQuestion.choices[selected].feedback}</p>}
    <div style={{display:"flex",gap:10,justifyContent:"space-between",flexWrap:"wrap"}}>
     <button type="button" disabled={questionIndex===0} onClick={()=>setQuestionIndex(i=>i-1)} style={buttonBase}>Previous question</button>
     <button type="button" disabled={questionIndex===questions.length-1} onClick={()=>setQuestionIndex(i=>i+1)} style={{...buttonBase,background:green,color:"#fff"}}>Next question</button>
    </div>
    <small>Questions are optional. Each question records only the first answer selected.</small>
   </section>}
   <nav aria-label="Story scene navigation" style={{display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
    <button type="button" disabled={index===0} onClick={()=>{saveReadingPosition(story.slug,index-1);setIndex(i=>i-1);setQuestionIndex(0)}} style={buttonBase}>← Previous scene</button>
    <button type="button" onClick={next} style={{...buttonBase,background:green,color:"#fff"}}>{index===story.scenes.length-1?"Finish story":"Next scene →"}</button>
   </nav>
  </>}
  <small style={{color:"#657369"}}>Your last scene is saved on this device when you navigate between scenes. English editorial preview. Illustrations, audio and reviewed translations are not yet available. Guest progress is stored in this browser only; it does not affect FEW Quest competition scores.</small>
 </section>;
}
