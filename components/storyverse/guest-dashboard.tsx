"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {emptyProgress,loadGuest,saveGuest,storyPoints,guestBadges,type GuestProgress} from "@/lib/storyverse/guest-progress";
export function GuestDashboard({locale}:{locale:string}){
 const [progress,setProgress]=useState<GuestProgress>(emptyProgress);const [ready,setReady]=useState(false);
 useEffect(()=>{const update=()=>setProgress(loadGuest());update();setReady(true);window.addEventListener("storyverse-progress",update);return()=>window.removeEventListener("storyverse-progress",update);},[]);
 function changeLevel(value:1|2|3){const next={...progress,level:value};saveGuest(next);setProgress(next);}
 function clear(){if(window.confirm("Delete this device's StoryVerse guest progress?")){localStorage.removeItem("lifews.storyverse.guest.v1");window.dispatchEvent(new Event("storyverse-progress"));}}
 return <section aria-label="Your guest story journey" style={{background:"#fff",border:"1px solid #dce6df",borderRadius:18,padding:24,marginBlock:24}}>
 <h2>Your Story Journey</h2><p>Read at home, with family, or in a classroom. No school registration required for this guest preview.</p>
 <div style={{display:"flex",gap:20,flexWrap:"wrap"}}><strong>{ready?storyPoints(progress):"—"} StoryPoints</strong><strong>{ready?progress.completedStories.length:"—"} completed stories</strong><strong>{ready?guestBadges(progress).length:"—"} badges</strong></div>
 <p>Badges: {ready?(guestBadges(progress).join(" · ")||"Your first badge awaits!"):"Loading…"}</p>
 <label htmlFor="sv-level">Preferred reading level </label><select id="sv-level" value={progress.level} onChange={e=>changeLevel(Number(e.target.value) as 1|2|3)} disabled={!ready} style={{padding:10,margin:8}}><option value={1}>Level 1 — Little Explorers</option><option value={2}>Level 2 — Story Adventurers</option><option value={3}>Level 3 — Master Storytellers</option></select>
 <p><Link href={`/${locale}/storyverse`}>Browse stories</Link></p>
 <button type="button" onClick={clear} disabled={!ready}>Clear guest progress on this device</button>
 <p><small>Guest progress is stored only in this browser on this device. It is not a secure account, cannot sync across devices, and may be lost when browser data is cleared. Do not enter personal or child information.</small></p>
 </section>;
}
