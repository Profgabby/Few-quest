"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {storyThemes,TARGET_PER_TIER} from "@/lib/storyverse/theme-catalog";

const tiers=[{id:1,name:"Little Explorers",count:70},{id:2,name:"Story Adventurers",count:70},{id:3,name:"Master Storytellers",count:60}] as const;
const pilotTitles:Record<string,string>={garden:"The Seed That Waited",science:"The Shadow That Changed Its Mind",family:"The Saturday Table",culture:"The Cloth with Two Stories",adventure:"The Map Beyond the Footbridge"};
const total=storyThemes.length*200;
function slotId(theme:string,n:number){return `SV-${theme.toUpperCase()}-${String(n).padStart(3,"0")}`;}
function tierFor(n:number){return n<=70?1:n<=140?2:3;}
export function EditorialStoryHolders({locale}:{locale:string}){
 const [theme,setTheme]=useState("garden");
 const [tier,setTier]=useState("all");
 const [page,setPage]=useState(1);
 const [query,setQuery]=useState("");
 const [selected,setSelected]=useState<number|null>(null);
 const category=storyThemes.find(([id])=>id===theme);
 const slots=useMemo(()=>Array.from({length:200},(_,i)=>i+1).filter(n=>(tier==="all"||tierFor(n)===Number(tier))&&(`${slotId(theme,n)} ${n===1&&pilotTitles[theme]?pilotTitles[theme]:""}`.toLowerCase().includes(query.toLowerCase().trim()))),[theme,tier,query]);
 const maxPage=Math.max(1,Math.ceil(slots.length/20));
 const shown=slots.slice((Math.min(page,maxPage)-1)*20,Math.min(page,maxPage)*20);
 const selectTheme=(v:string)=>{setTheme(v);setPage(1);setSelected(null);};
 const chooseTier=(v:string)=>{setTier(v);setPage(1);setSelected(null);};
 return <section aria-label="Editorial story-holder mockup">
 <p className="sv-lead">Editorial planning mockup: {storyThemes.length} verified categories × 200 reserved story slots = {total.toLocaleString("en-US")} planned stories. Slots are NOT manuscripts, approved illustrations, or published books.</p>
 <div className="sv-panel"><h2>Browse the planned catalog</h2><div className="sv-library-filters">
 <label>Category<select value={theme} onChange={e=>selectTheme(e.target.value)}>{storyThemes.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label>
 <label>Reading tier<select value={tier} onChange={e=>chooseTier(e.target.value)}><option value="all">All levels (200)</option>{tiers.map(t=><option key={t.id} value={t.id}>{t.name} ({t.count})</option>)}</select></label>
 <label>Find a slot<input value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} placeholder="e.g. SV-GARDEN-001"/></label>
 </div><p className="sv-muted">Selected: {category?.[1]} · {slots.length} matching slots. Editorial access mockup only; no authentication or database is connected.</p>
 <div className="sv-grid">{shown.map(n=><article className="sv-card" key={n}>
 <div style={{height:116,borderRadius:10,background:"linear-gradient(140deg,#e7f2e9,#f9f3d7)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#346047",gap:8}}><span style={{fontSize:28}} aria-hidden="true">▧</span><small>Cover illustration pending</small></div>
 <span className="sv-tag">{slotId(theme,n)} · Tier {tierFor(n)}</span><h3>{n===1&&pilotTitles[theme]?pilotTitles[theme]:`Story holder ${String(n).padStart(3,"0")}`}</h3>
 <p className="sv-muted">{tiers[tierFor(n)-1].name} · {n===1&&pilotTitles[theme]?"Pilot editorial reference":"Unassigned story concept"}</p>
 <button type="button" onClick={()=>setSelected(selected===n?null:n)} aria-expanded={selected===n}>{selected===n?"Close holder":"View editorial holder"}</button>
 {selected===n&&<div style={{marginTop:12}}><p><strong>Manuscript:</strong> not attached</p><p><strong>Four scene images:</strong> placeholders only</p><p><strong>Activities:</strong> awaiting approved content</p><p><strong>Status:</strong> reserved / not published</p></div>}
 </article>)}</div>
 {shown.length===0&&<p>No matching story slots.</p>}
 <div className="sv-actions"><button type="button" disabled={page<=1} onClick={()=>{setPage(p=>Math.max(1,p-1));setSelected(null);}}>Previous</button><span>Page {Math.min(page,maxPage)} of {maxPage}</span><button type="button" disabled={page>=maxPage} onClick={()=>{setPage(p=>Math.min(maxPage,p+1));setSelected(null);}}>Next</button></div>
 </div><div className="sv-panel"><h2>Story reader template</h2><p>When approved, each story will contain a cover, story metadata, four illustrated scenes, manuscript text, comprehension questions, a reading activity, and editorial credits.</p><div className="sv-grid">{["Cover and metadata","Scene 1 · Opening","Scene 2 · Discovery","Scene 3 · Challenge","Scene 4 · Resolution","Questions and activity"].map((s,i)=><div className="sv-card" key={s}><span className="sv-tag">Section {i+1}</span><h3>{s}</h3><p className="sv-muted">Awaiting approved editorial content</p></div>)}</div><p className="sv-muted">Existing readable prototypes remain available in the <Link href={`/${locale}/storyverse/library`}>Story Library</Link>. This mockup does not change them.</p></div>
 </section>;
}
