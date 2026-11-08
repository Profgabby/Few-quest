"use client";
import Image from "next/image";
import Link from "next/link";
import {useMemo,useState} from "react";
import type {Story,StoryLevel} from "@/lib/storyverse/catalog";
import {storyThemes,storyConcepts} from "@/lib/storyverse/theme-catalog";
import {discoveryGroups,categoryToGroup,storySubcategories} from "@/lib/storyverse/discovery-taxonomy";

const levels:{id:StoryLevel;name:string;description:string;image:string}[]=[
 {id:1,name:"Little Explorers",description:"Picture-led discoveries and first reading steps",image:"little-explorers.webp.png"},
 {id:2,name:"Story Adventurers",description:"Mysteries, adventures and meaningful choices",image:"story-adventurers.webp.png"},
 {id:3,name:"Master Storytellers",description:"Deeper questions, investigations and reflection",image:"master-storytellers.webp.png"}
];
const images:Record<string,string>={"little-seed":"little-seed-story.webp.png","missing-watering-can":"missing-watering-can.webp.png"};
const worldCategory:Record<string,string>={GardenVerse:"garden",ScienceVerse:"science",FamilyVerse:"family",CultureVerse:"culture",AdventureVerse:"adventure"};
const root="/storyverse/images/";
export function StoryLibrary({stories,locale,initialLevel}:{stories:Story[];locale:string;initialLevel?:string}){
 const [level,setLevel]=useState<StoryLevel|"all">(initialLevel==="1"||initialLevel==="2"||initialLevel==="3"?Number(initialLevel) as StoryLevel:"all");
 const [group,setGroup]=useState("all");
 const [category,setCategory]=useState("all");
 const [search,setSearch]=useState("");
 const [mobileFilters,setMobileFilters]=useState(false);
 const [page,setPage]=useState(1);
 const groupCategories=useMemo(()=>storyThemes.filter(([id])=>group==="all"||categoryToGroup[id]===group),[group]);
 const selectedCategory=storyThemes.find(([id])=>id===category);
 const availableTopics=storySubcategories[category]??[];
 // Only readable content is listed here. Editorial concepts are intentionally excluded.
 const visible=stories.filter(s=>{
  const id=worldCategory[s.world]??"";
  const matchesGroup=group==="all"||categoryToGroup[id]===group;
  const matchesCategory=category==="all"||id===category;
  const matchesLevel=level==="all"||s.levelNumber===level;
  const q=search.trim().toLowerCase();
  const matchesSearch=!q||[s.title,s.description,s.world,s.gardenCode??"",storyThemes.find(([key])=>key===id)?.[1]??"",discoveryGroups.find(g=>g.id===categoryToGroup[id])?.name??""].join(" ").toLowerCase().includes(q);
  // Topic assignment requires reviewed story metadata; do not guess it from titles.
  return matchesGroup&&matchesCategory&&matchesLevel&&matchesSearch;
 });
 const concepts=storyConcepts.filter(c=>(group==="all"||categoryToGroup[c.themeId]===group)&&(category==="all"||c.themeId===category)&&(level==="all"||c.tier===level)&&(!search.trim()||`${c.title} ${c.id} ${c.theme}`.toLowerCase().includes(search.trim().toLowerCase())));
 const pageCount=Math.max(1,Math.ceil(concepts.length/18));
 const currentPage=Math.min(page,pageCount);
 const shownConcepts=concepts.slice((currentPage-1)*18,currentPage*18);
 const clear=()=>{setGroup("all");setCategory("all");setLevel("all");setSearch("");};
 return <section className="sv-library" aria-label="Browse stories">
 <div style={{margin:"20px 0 26px"}}><label htmlFor="sv-story-search" style={{fontWeight:700,display:"block",marginBottom:8}}>Find a story</label><input id="sv-story-search" type="search" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search by story title, subject or category" style={{width:"100%",padding:"15px 18px",borderRadius:12,border:"1px solid #b7d3c3",fontSize:16}}/></div>
 <div className="sv-grid sv-photo-grid" aria-label="Choose a reading level">{levels.map(l=><button type="button" key={l.id} className="sv-level-choice" aria-pressed={level===l.id} onClick={()=>{setLevel(level===l.id?"all":l.id);setPage(1);}}><span className="sv-level-choice-image"><Image src={root+l.image} alt="" fill sizes="(max-width:600px) 100vw, 33vw"/></span><span className="sv-level-choice-text"><strong>{l.name}</strong><small>{l.description}</small></span></button>)}</div>
 <button className="sv-discovery-toggle" type="button" onClick={()=>setMobileFilters(v=>!v)} aria-expanded={mobileFilters} aria-controls="sv-library-filters" style={{padding:"10px 16px",margin:"18px 0",borderRadius:9,border:"1px solid #006B3C",background:"white",color:"#006B3C",fontWeight:700}}> {mobileFilters?"Hide filters":"Browse categories & filters"} </button>
 <style>{`@media(max-width:767px){.sv-discovery-sidebar:not(.sv-discovery-sidebar-open){display:none!important}.sv-discovery-layout{display:block!important}.sv-discovery-results{grid-column:auto!important}}@media(min-width:768px){.sv-discovery-toggle{display:none!important}}`}</style><div className="sv-discovery-layout" style={{display:"grid",gridTemplateColumns:"minmax(240px,290px) minmax(0,1fr)",gap:24,alignItems:"start"}}>
 <aside className={`sv-discovery-sidebar ${mobileFilters?"sv-discovery-sidebar-open":""}`} id="sv-library-filters" aria-label="Story filters" style={{display:mobileFilters?"block":"block",border:"1px solid #d5e5da",borderRadius:16,padding:18,background:"#f7fbf8"}}>
 <h2 style={{fontSize:21,marginTop:0}}>Explore by category</h2>
 <label style={{display:"block",marginBottom:12}}>Discovery group<select style={{width:"100%",marginTop:5}} value={group} onChange={e=>{setGroup(e.target.value);setCategory("all");setPage(1);}}><option value="all">All discovery groups</option>{discoveryGroups.map(g=><option value={g.id} key={g.id}>{g.name}</option>)}</select></label>
 <label style={{display:"block",marginBottom:12}}>Category<select style={{width:"100%",marginTop:5}} value={category} onChange={e=>{setCategory(e.target.value);setPage(1);}}><option value="all">All categories</option>{groupCategories.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label>
 {category!=="all"&&availableTopics.length>0&&<div style={{marginBottom:12}}><p style={{fontWeight:700,marginBottom:6}}>Topics in this category</p><p className="sv-muted">Topic browsing is being prepared. Stories will appear here once reviewed topic tags are added.</p><ul style={{paddingLeft:18}}>{availableTopics.map(t=><li key={t}>{t}</li>)}</ul></div>}
 <label style={{display:"block",marginBottom:12}}>Reading level<select style={{width:"100%",marginTop:5}} value={String(level)} onChange={e=>{setLevel(e.target.value==="all"?"all":Number(e.target.value) as StoryLevel);setPage(1);}}><option value="all">All reading levels</option>{levels.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label>
 <button type="button" onClick={clear}>Clear filters</button>
 <h3 style={{marginTop:24}}>Discovery groups</h3>
 <nav aria-label="Discovery groups"><button type="button" onClick={()=>{setGroup("all");setCategory("all");}} aria-pressed={group==="all"}>All stories</button>{discoveryGroups.map(g=><div key={g.id} style={{marginTop:12}}><button type="button" aria-pressed={group===g.id} onClick={()=>{setGroup(g.id);setCategory("all");}} style={{fontWeight:700,textAlign:"left"}}>{g.name}</button>{group===g.id&&<ul style={{paddingLeft:20,margin:"8px 0"}}>{groupCategories.map(([id,name])=><li key={id}><button type="button" aria-pressed={category===id} onClick={()=>{setCategory(id);}} style={{textAlign:"left"}}>{name}</button></li>)}</ul>}</div>)}</nav>
 </aside>
 <div className="sv-discovery-results" style={{minWidth:0}}>
 <h2>{selectedCategory?.[1]??discoveryGroups.find(g=>g.id===group)?.name??"Stories to explore"}</h2>
 <p className="sv-muted" role="status">{visible.length===0?"No stories match these filters yet. Try another category or reading level.":`${visible.length} ${visible.length===1?"story":"stories"} to explore`}</p>
 <div className="sv-grid sv-photo-grid">{visible.map(s=><article className="sv-card sv-photo-card" key={s.slug}>
 {images[s.slug]?<div className="sv-card-media"><Image src={root+images[s.slug]} alt={s.title} fill sizes="(max-width:600px) 100vw, 33vw"/></div>:<div className="sv-card-media sv-card-media-fallback">StoryVerse</div>}
 <div className="sv-card-body"><span className="sv-tag">{s.world} · {s.level}</span><h3>{s.title}</h3><p>{s.description}</p><Link href={`/${locale}/storyverse/read/${s.slug}`}>Read story →</Link></div></article>)}</div>
 <section style={{marginTop:28}} aria-label="Story ideas by reading tier"><h2>Explore more story ideas</h2><p className="sv-muted">These titles are in development, not complete books. Select a title to view its synopsis.</p>{[1,2,3].filter(t=>level==="all"||level===t).map(t=><div key={t}><h3>{levels[t-1].name}</h3><div className="sv-grid">{shownConcepts.filter(c=>c.tier===t).map(c=><article className="sv-card" key={c.id}><span className="sv-tag">{c.theme}</span><h4>{c.title}</h4><p className="sv-muted">Story idea</p><Link href={`/${locale}/storyverse/concept/${encodeURIComponent(c.id)}`}>View story idea →</Link></article>)}</div></div>)}<div className="sv-actions"><button type="button" disabled={currentPage<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button><span>Page {currentPage} of {pageCount}</span><button type="button" disabled={currentPage>=pageCount} onClick={()=>setPage(p=>Math.min(pageCount,p+1))}>Next</button></div></section>
 </div></div>
 <div style={{marginTop:28,textAlign:"center"}}><Link href={`/${locale}/storyverse`}>← Return to StoryVerse Home</Link></div>
 </section>;
}
