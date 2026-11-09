"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import type {Story} from "@/lib/storyverse/catalog";
import {loadGuest} from "@/lib/storyverse/guest-progress";
import {loadReadingShelf,type ReadingShelf} from "@/lib/storyverse/reading-shelf";
export function MyReadingShelf({stories,locale}:{stories:Story[];locale:string}){
 const [shelf,setShelf]=useState<ReadingShelf>({});
 const [completed,setCompleted]=useState<string[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  function refresh(){setShelf(loadReadingShelf());setCompleted(loadGuest().completedStories);setReady(true);}
  refresh();
  window.addEventListener("storyverse-reading-shelf",refresh);
  window.addEventListener("storyverse-progress",refresh);
  window.addEventListener("storage",refresh);
  return ()=>{window.removeEventListener("storyverse-reading-shelf",refresh);window.removeEventListener("storyverse-progress",refresh);window.removeEventListener("storage",refresh);};
 },[]);
 const finished=stories.filter(s=>completed.includes(s.slug));
 const inProgress=stories.filter(s=>!completed.includes(s.slug)&&shelf[s.slug]!==undefined).sort((a,b)=>shelf[b.slug].updatedAt-shelf[a.slug].updatedAt);
 return <section aria-label="My Reading Shelf" style={{background:"#f3f8ed",border:"1px solid #d4e4d4",borderRadius:20,padding:"clamp(18px,3vw,28px)",margin:"20px 0 30px"}}>
  <h2 style={{margin:"0 0 8px",color:"#164e33"}}>My Reading Shelf</h2>
  <p style={{color:"#53675b",margin:"0 0 16px"}}>Pick up where you stopped, or enjoy a finished story again. Saved only in this browser on this device.</p>
  {!ready?<p role="status">Checking your reading shelf…</p>:<>
   <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:18}}><strong>{inProgress.length} started</strong><strong>{finished.length} completed</strong></div>
   {inProgress.length===0&&finished.length===0?<p>No books on your shelf yet. Choose a story below to begin reading!</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,240px),1fr))",gap:14}}>
    {inProgress.map(story=><article key={story.slug} style={{background:"#fff",padding:18,borderRadius:14,border:"1px solid #d7e4d9"}}><span style={{fontSize:12,fontWeight:700,color:"#477456"}}>IN PROGRESS</span><h3 style={{fontSize:18,margin:"9px 0"}}>{story.title}</h3><p style={{fontSize:14,color:"#53675b"}}>Scene {Math.min(shelf[story.slug].scene+1,story.scenes.length)} of {story.scenes.length}</p><progress aria-label={`Progress in ${story.title}`} value={shelf[story.slug].scene+1} max={story.scenes.length} style={{width:"100%",accentColor:"#145438"}}/><p><Link href={`/${locale}/storyverse/read/${story.slug}`} style={{color:"#145438",fontWeight:750}}>Continue Reading →</Link></p></article>)}
    {finished.map(story=><article key={story.slug} style={{background:"#fff",padding:18,borderRadius:14,border:"1px solid #d7e4d9"}}><span style={{fontSize:12,fontWeight:700,color:"#477456"}}>COMPLETED ✓</span><h3 style={{fontSize:18,margin:"9px 0"}}>{story.title}</h3><p style={{fontSize:14,color:"#53675b"}}>{story.scenes.length} scenes finished</p><p><Link href={`/${locale}/storyverse/read/${story.slug}`} style={{color:"#145438",fontWeight:750}}>Read Again →</Link></p></article>)}
   </div>}
  </>}
  <small style={{display:"block",marginTop:16,color:"#66756b"}}>Guest shelf is not synced between devices or accounts. Clearing browser storage may erase your reading history.</small>
 </section>;
}
