"use client";
import Link from "next/link";
import {useState} from "react";
import type {Story,StoryLevel} from "@/lib/storyverse/catalog";
const levels:{id:StoryLevel;name:string;description:string}[]=[
 {id:1,name:"Little Explorers",description:"Short stories, pictures and simple choices — suitable for any beginner."},
 {id:2,name:"Story Adventurers",description:"Mysteries, adventures and meaningful choices."},
 {id:3,name:"Master Storytellers",description:"Deeper questions, investigations and reflection."}
];
export function StoryLibrary({stories,locale}:{stories:Story[];locale:string}){
 const [level,setLevel]=useState<StoryLevel|"all">("all");
 const [search,setSearch]=useState("");
 const visible=stories.filter(s=>(level==="all"||s.levelNumber===level)&&`${s.title} ${s.description} ${s.world}`.toLowerCase().includes(search.trim().toLowerCase()));
 return <section aria-label="Browse stories" style={{display:"grid",gap:18}}>
 <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><button type="button" aria-pressed={level==="all"} onClick={()=>setLevel("all")}>All levels</button>{levels.map(l=><button key={l.id} type="button" aria-pressed={level===l.id} onClick={()=>setLevel(l.id)}>Level {l.id}: {l.name}</button>)}</div>
 <label style={{display:"grid",gap:6,maxWidth:450}}>Find a story<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search stories or topics" style={{padding:12,borderRadius:10,border:"1px solid #a8b9ae"}}/></label>
 {level!=="all"&&<p>{levels.find(l=>l.id===level)?.description} You can switch levels at any time, regardless of age.</p>}
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:16}}>{visible.map(s=><article key={s.slug} style={{border:"1px solid #dce6df",padding:22,borderRadius:16,background:"white"}}><p style={{color:"#006B3C",fontWeight:700}}>Level {s.levelNumber} · {s.world}</p><h3>{s.title}</h3><p>{s.description}</p>{s.gardenCode&&<p>Garden connection: {s.gardenCode}</p>}<Link href={`/${locale}/storyverse/read/${s.slug}`} style={{fontWeight:700,color:"#006B3C"}}>Read this story →</Link></article>)}</div>
 {visible.length===0&&<p role="status">No stories match these filters. Try another level or search.</p>}
 </section>;
}
