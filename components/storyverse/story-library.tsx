"use client";
import Image from "next/image";
import Link from "next/link";
import {useMemo,useState} from "react";
import type {Story,StoryLevel} from "@/lib/storyverse/catalog";

const levels:{id:StoryLevel;name:string;description:string;image:string}[]=[
 {id:1,name:"Little Explorers",description:"Picture-led discoveries and first reading steps",image:"little-explorers.webp.png"},
 {id:2,name:"Story Adventurers",description:"Mysteries, adventures and meaningful choices",image:"story-adventurers.webp.png"},
 {id:3,name:"Master Storytellers",description:"Deeper questions, investigations and reflection",image:"master-storytellers.webp.png"}
];
const images:Record<string,string>={
 "little-seed":"little-seed-story.webp.png",
 "missing-watering-can":"missing-watering-can.webp.png"
};
const root="/storyverse/images/";
export function StoryLibrary({stories,locale,initialLevel}:{stories:Story[];locale:string;initialLevel?:string}){
 const initial=initialLevel;
 const [level,setLevel]=useState<StoryLevel|"all">(initial==="1"||initial==="2"||initial==="3"?Number(initial) as StoryLevel:"all");
 const [world,setWorld]=useState("All worlds");
 const [search,setSearch]=useState("");
 const worlds=useMemo(()=>["All worlds",...Array.from(new Set(stories.map(s=>s.world)))], [stories]);
 const visible=stories.filter(s=>(level==="all"||s.levelNumber===level)&&(world==="All worlds"||s.world===world)&&`${s.title} ${s.description} ${s.world} ${s.gardenCode??""}`.toLowerCase().includes(search.trim().toLowerCase()));
 return <section aria-label="Browse stories" className="sv-library">
  <div className="sv-grid sv-photo-grid" aria-label="Choose a reading level">{levels.map(l=><button type="button" key={l.id} className="sv-level-choice" aria-pressed={level===l.id} onClick={()=>setLevel(level===l.id?"all":l.id)}>
   <span className="sv-level-choice-image"><Image src={root+l.image} alt="" fill sizes="(max-width:600px) 100vw, 33vw"/></span>
   <span className="sv-level-choice-text"><strong>Level {l.id} · {l.name}</strong><small>{l.description}</small></span>
  </button>)}</div>
  <div className="sv-library-filters">
   <label>Search stories<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Title, topic or garden code"/></label>
   <label>Story world<select value={world} onChange={e=>setWorld(e.target.value)}>{worlds.map(w=><option key={w}>{w}</option>)}</select></label>
   <button type="button" onClick={()=>{setLevel("all");setWorld("All worlds");setSearch("");}}>Clear filters</button>
  </div>
  <p role="status" className="sv-muted">Showing {visible.length} of {stories.length} editorial pilot stories. All reading levels are open to every age.</p>
  <div className="sv-grid sv-photo-grid">{visible.map(s=><article className="sv-card sv-photo-card" key={s.slug}>
   {images[s.slug]?<div className="sv-card-media"><Image src={root+images[s.slug]} alt={s.title} fill sizes="(max-width:600px) 100vw, 33vw"/></div>:<div className="sv-card-media sv-card-media-fallback">ScienceVerse · Water &amp; Sustainability</div>}
   <div className="sv-card-body"><span className="sv-tag">Level {s.levelNumber} · {s.world}</span><h2>{s.title}</h2><p>{s.description}</p>{s.gardenCode&&<p className="sv-muted">Garden connection: {s.gardenCode}</p>}<Link href={`/${locale}/storyverse/read/${s.slug}`}>Read this story →</Link></div>
  </article>)}</div>
  {visible.length===0&&<p role="status">No stories match your filters. Try another level or clear the filters.</p>}
 </section>;
}
