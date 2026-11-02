"use client";
import {useState} from "react";
import Link from "next/link";
import {stories} from "@/lib/storyverse/catalog";
import {Panel,Notice} from "./studio-shell";
export function FamilyPreview({locale="en"}:{locale?:string}){
 const [story,setStory]=useState(stories[0]?.slug??"");
 const [mode,setMode]=useState("Read together");
 const [goal,setGoal]=useState("2");
 const [days,setDays]=useState<string[]>(["Saturday"]);
 const [copied,setCopied]=useState(false);
 const chosen=stories.find(s=>s.slug===story);
 const plan=["LIFEWS StoryVerse family reading plan","Story: "+(chosen?.title??"Not selected"),"Activity: "+mode,"Sessions each week: "+goal,"Preferred days: "+(days.join(", ")||"Flexible"),"Discuss: What surprised you? What would you do differently?"].join("\n");
 function toggle(day:string){setDays(old=>old.includes(day)?old.filter(d=>d!==day):[...old,day]);setCopied(false);}
 async function copyPlan(){try{await navigator.clipboard.writeText(plan);setCopied(true);}catch{setCopied(false);}}
 return <>
 <Notice>Family planning preview. No accounts, child profiles, names, birthdays, or shared reading histories are collected.</Notice>
 <div className="sv-grid">
  <div className="sv-card"><h2>Read together</h2><p>Choose a story for families, caregivers, adult readers, or reading groups.</p></div>
  <div className="sv-card"><h2>Build a reading habit</h2><p>Choose weekly sessions and optional preferred days.</p></div>
  <div className="sv-card"><h2>Protect privacy</h2><p>Your plan stays on this page unless you choose to copy it.</p></div>
 </div>
 <Panel title="Plan a reading session">
 <label className="sv-label" htmlFor="family-story">Story</label>
 <select className="sv-field" id="family-story" value={story} onChange={e=>{setStory(e.target.value);setCopied(false);}}>{stories.map(s=><option value={s.slug} key={s.slug}>{s.title}</option>)}</select>
 <label className="sv-label" htmlFor="family-mode">Activity</label>
 <select className="sv-field" id="family-mode" value={mode} onChange={e=>{setMode(e.target.value);setCopied(false);}}><option>Read together</option><option>Discuss a story</option><option>Explore a challenge</option></select>
 <label className="sv-label" htmlFor="family-goal">Sessions per week</label>
 <select className="sv-field" id="family-goal" value={goal} onChange={e=>{setGoal(e.target.value);setCopied(false);}}>{[1,2,3,4,5,6,7].map(n=><option key={n} value={String(n)}>{n}</option>)}</select>
 <fieldset style={{border:"1px solid #d8e7df",borderRadius:12,padding:16}}><legend>Preferred days (optional)</legend><div style={{display:"flex",gap:14,flexWrap:"wrap"}}>{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day=><label key={day}><input type="checkbox" checked={days.includes(day)} onChange={()=>toggle(day)}/> {day}</label>)}</div></fieldset>
 <div className="sv-actions"><button type="button" className="sv-button" onClick={()=>{void copyPlan();}}>Copy reading plan</button><Link className="sv-button alt" href={`/${locale}/storyverse/read/${story}`}>Open selected story</Link></div>
 <pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere",background:"#f4f8f5",padding:16,borderRadius:12}}>{plan}</pre>
 {copied&&<p role="status">Reading plan copied to clipboard.</p>}
 </Panel>
 <Panel title="Guardian controls — future development"><p>Supervised profiles, consent, role permissions, data deletion, and synchronized progress require a separate security and privacy review. These features are not active in this preview.</p></Panel>
 </>;
}
