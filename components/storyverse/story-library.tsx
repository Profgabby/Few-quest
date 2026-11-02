"use client";
import Image from "next/image";
import Link from "next/link";
import {useMemo,useState} from "react";
import type {Story,StoryLevel} from "@/lib/storyverse/catalog";
import {storyThemes,storyConcepts,STORY_COLLECTION_TARGET,TARGET_STORIES_PER_THEME} from "@/lib/storyverse/theme-catalog";

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
 const [theme,setTheme]=useState("all");
 const [audience,setAudience]=useState("Individual reader");
 const [page,setPage]=useState(1);
 const concepts=storyConcepts.filter(c=>(theme==="all"||c.themeId===theme)&&(level==="all"||c.tier===level)&&`${c.title} ${c.id} ${c.summary}`.toLowerCase().includes(search.trim().toLowerCase()));
 const pages=Math.max(1,Math.ceil(concepts.length/30));
 const currentPage=Math.min(page,pages);
 const shownConcepts=concepts.slice((currentPage-1)*30,currentPage*30);
 const worlds=useMemo(()=>["All worlds",...Array.from(new Set(stories.map(s=>s.world)))], [stories]);
 const visible=stories.filter(s=>(level==="all"||s.levelNumber===level)&&(world==="All worlds"||s.world===world)&&`${s.title} ${s.description} ${s.world} ${s.gardenCode??""}`.toLowerCase().includes(search.trim().toLowerCase()));
 return <section aria-label="Browse stories" className="sv-library">
  <div className="sv-grid sv-photo-grid" aria-label="Choose a reading level">{levels.map(l=><button type="button" key={l.id} className="sv-level-choice" aria-pressed={level===l.id} onClick={()=>{setLevel(level===l.id?"all":l.id);setPage(1);}}>
   <span className="sv-level-choice-image"><Image src={root+l.image} alt="" fill sizes="(max-width:600px) 100vw, 33vw"/></span>
   <span className="sv-level-choice-text"><strong>Level {l.id} · {l.name}</strong><small>{l.description}</small></span>
  </button>)}</div>
  <div className="sv-library-filters">
   <label>Reader group<select value={audience} onChange={e=>setAudience(e.target.value)}>{["Individual reader","Family or caregiver","Teacher or classroom","School reading club","Community reading group","Adult learner","Librarian or facilitator","Story creator"].map(a=><option key={a}>{a}</option>)}</select></label>
   <label>Category / theme<select value={theme} onChange={e=>{setTheme(e.target.value);setPage(1);}}><option value="all">All 60 categories</option>{storyThemes.map(([id,name])=><option key={id} value={id}>{name} · 200-story target</option>)}</select></label>
   <label>Search stories<input type="search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Title, topic or garden code"/></label>
   <label>Story world<select value={world} onChange={e=>setWorld(e.target.value)}>{worlds.map(w=><option key={w}>{w}</option>)}</select></label>
   <button type="button" onClick={()=>{setLevel("all");setWorld("All worlds");setSearch("");setTheme("all");setPage(1);}}>Clear filters</button>
  </div>
  <p role="status" className="sv-muted">Showing {visible.length} of {stories.length} editorial pilot stories. All reading levels are open to every age.</p>
  <div className="sv-grid sv-photo-grid">{visible.map(s=><article className="sv-card sv-photo-card" key={s.slug}>
   {images[s.slug]?<div className="sv-card-media"><Image src={root+images[s.slug]} alt={s.title} fill sizes="(max-width:600px) 100vw, 33vw"/></div>:<div className="sv-card-media sv-card-media-fallback">ScienceVerse · Water &amp; Sustainability</div>}
   <div className="sv-card-body"><span className="sv-tag">Level {s.levelNumber} · {s.world}</span><h2>{s.title}</h2><p>{s.description}</p>{s.gardenCode&&<p className="sv-muted">Garden connection: {s.gardenCode}</p>}<Link href={`/${locale}/storyverse/read/${s.slug}`}>Read this story →</Link></div>
  </article>)}</div>
  {visible.length===0&&<p role="status">No readable pilot story matches these filters. Browse planned concepts below.</p>}
  <section aria-label="Planned StoryVerse collection"><h2>{storyThemes.length} themes · {STORY_COLLECTION_TARGET.toLocaleString("en-US")} story roadmap</h2><p className="sv-muted">Each category currently has 50 initial editorial concepts across three tiers (17 / 17 / 16), with a target of 200 original manuscripts per category. These concepts are not completed stories. The 3 readable pilot stories are displayed above.</p><p role="status">Showing {shownConcepts.length} of {concepts.length} concepts · Reader group: {audience}</p><div className="sv-grid">{shownConcepts.map(c=><article className="sv-card" key={c.id}><span className="sv-tag">{c.id} · Tier {c.tier}</span><h3>{c.title}</h3><p>{c.summary}</p><p className="sv-muted">{c.tierName} · Concept awaiting manuscript</p></article>)}</div><div className="sv-actions"><button type="button" disabled={currentPage===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button><span aria-live="polite">Page {currentPage} of {pages}</span><button type="button" disabled={currentPage===pages} onClick={()=>setPage(p=>Math.min(pages,p+1))}>Next</button></div></section>
 </section>;
}
