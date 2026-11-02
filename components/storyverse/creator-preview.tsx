"use client";
import {useState} from "react";
import {Panel,Notice} from "./studio-shell";
type DraftScene={heading:string;body:string;question:string};
const worlds=["GardenVerse","ScienceVerse","FamilyVerse","CultureVerse","AdventureVerse","LittleVerse","LifeVerse","MathVerse","FutureVerse","CreatorVerse"];
export function CreatorPreview(){
 const [title,setTitle]=useState("");
 const [world,setWorld]=useState("GardenVerse");
 const [level,setLevel]=useState("Little Explorers");
 const [language,setLanguage]=useState("English");
 const [scenes,setScenes]=useState<DraftScene[]>([{heading:"Scene 1",body:"",question:""}]);
 const [result,setResult]=useState("");
 const update=(index:number,key:keyof DraftScene,value:string)=>setScenes(old=>old.map((scene,i)=>i===index?{...scene,[key]:value}:scene));
 const valid=title.trim().length>0&&scenes.every(s=>s.heading.trim()&&s.body.trim());
 function exportDraft(){
  if(!valid)return;
  const data={format:"storyverse-editorial-draft-v2",title:title.trim(),world,level,language,scenes:scenes.map(s=>({heading:s.heading.trim(),body:s.body.trim(),question:s.question.trim()||null})),status:"private-draft",publicationApproved:false};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="storyverse-private-draft.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  setResult("Private draft exported. Nothing was submitted, saved to an account, or published.");
 }
 return <><Notice>Private editor preview. Write multiple scenes and export a JSON manuscript. No uploads, publishing, or account storage are enabled.</Notice>
 <Panel title="Story details"><label className="sv-label" htmlFor="draft-title">Story title</label><input className="sv-field" id="draft-title" maxLength={120} value={title} onChange={e=>setTitle(e.target.value)}/>
 <label className="sv-label" htmlFor="draft-world">Story world</label><select className="sv-field" id="draft-world" value={world} onChange={e=>setWorld(e.target.value)}>{worlds.map(x=><option key={x}>{x}</option>)}</select>
 <label className="sv-label" htmlFor="draft-level">Reading level</label><select className="sv-field" id="draft-level" value={level} onChange={e=>setLevel(e.target.value)}>{["Little Explorers","Story Adventurers","Master Storytellers"].map(x=><option key={x}>{x}</option>)}</select>
 <label className="sv-label" htmlFor="draft-language">Draft language</label><select className="sv-field" id="draft-language" value={language} onChange={e=>setLanguage(e.target.value)}>{["English","Hausa","Yoruba","Igbo","French","Arabic","Spanish","Swahili"].map(x=><option key={x}>{x}</option>)}</select></Panel>
 <Panel title="Build your scenes">{scenes.map((scene,i)=><div key={i} style={{padding:"18px 0",borderBottom:"1px solid #d8e7df"}}><h3>Scene {i+1}</h3><label className="sv-label" htmlFor={`heading-${i}`}>Scene heading</label><input id={`heading-${i}`} className="sv-field" maxLength={120} value={scene.heading} onChange={e=>update(i,"heading",e.target.value)}/>
 <label className="sv-label" htmlFor={`body-${i}`}>Narrative</label><textarea id={`body-${i}`} className="sv-field" style={{minHeight:145}} maxLength={6000} value={scene.body} onChange={e=>update(i,"body",e.target.value)}/>
 <label className="sv-label" htmlFor={`question-${i}`}>Optional discussion question</label><input id={`question-${i}`} className="sv-field" maxLength={300} value={scene.question} onChange={e=>update(i,"question",e.target.value)}/>
 <button type="button" disabled={scenes.length===1} onClick={()=>setScenes(old=>old.filter((_,j)=>j!==i))}>Remove scene</button></div>)}
 <div className="sv-actions"><button type="button" className="sv-button alt" disabled={scenes.length>=20} onClick={()=>setScenes(old=>[...old,{heading:`Scene ${old.length+1}`,body:"",question:""}])}>Add scene</button><button type="button" className="sv-button" disabled={!valid} onClick={exportDraft}>Download private draft (JSON)</button></div>
 {!valid&&<p className="sv-muted">Enter a title, heading, and narrative for every scene to enable export.</p>}{result&&<p role="status">{result}</p>}</Panel>
 <Notice>Drafts are not automatically published. Editorial review, safeguarding, copyright clearance, and translation approval remain separate future workflows.</Notice></>;
}