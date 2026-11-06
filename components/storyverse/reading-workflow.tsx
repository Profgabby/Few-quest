"use client";
import {useState} from "react";
import Link from "next/link";
import {stories} from "@/lib/storyverse/catalog";
type Scope="school-a"|"school-b"|"family-a"|"family-b";
type Assignment={id:number;scope:Scope;storySlug:string;reader:string;status:"assigned"|"completed"|"reviewed";review?:string};
const initial:Assignment[]=[
 {id:1,scope:"school-a",storySlug:"little-seed",reader:"Fictional learner A1",status:"assigned"},
 {id:2,scope:"school-b",storySlug:"missing-watering-can",reader:"Fictional learner B1",status:"completed"},
 {id:3,scope:"family-a",storySlug:"water-challenge",reader:"Fictional family reader A1",status:"assigned"},
 {id:4,scope:"family-b",storySlug:"little-seed",reader:"Fictional family reader B1",status:"completed"}
];
const scopeOptions:Record<"school"|"community",{id:Scope;label:string}[]>={
 school:[{id:"school-a",label:"Sample School A"},{id:"school-b",label:"Sample School B"}],
 community:[{id:"family-a",label:"Sample Family A"},{id:"family-b",label:"Sample Family B"}]
};
export function ReadingWorkflow({locale,mode}:{locale:string;mode:"school"|"community"}){
 const [scope,setScope]=useState<Scope>(scopeOptions[mode][0].id);
 const [role,setRole]=useState<"educator"|"reader"|"guardian">(mode==="school"?"educator":"guardian");
 const [assignments,setAssignments]=useState<Assignment[]>(initial);
 const [storySlug,setStorySlug]=useState(stories[0].slug);
 const [feedback,setFeedback]=useState("");
 const [nextId,setNextId]=useState(5);
 const school=mode==="school";
 const own=assignments.filter(a=>a.scope===scope);
 const canAssign=school&&role==="educator"||!school&&role==="guardian";
 const canComplete=role==="reader";
 const canReview=school&&role==="educator";
 function add(){
  if(!canAssign)return;
  setAssignments(prev=>[...prev,{id:nextId,scope,storySlug,reader:school?"Fictional classroom learner":"Fictional family reader",status:"assigned"}]);
  setNextId(n=>n+1);setFeedback("Fictional assignment created in this browser session only.");
 }
 function complete(id:number){
  if(!canComplete)return;
  setAssignments(prev=>prev.map(a=>a.id===id&&a.scope===scope&&a.status==="assigned"?{...a,status:"completed"}:a));
  setFeedback("Sample reading marked complete. This does not update actual reading progress.");
 }
 function review(id:number){
  if(!canReview)return;
  setAssignments(prev=>prev.map(a=>a.id===id&&a.scope===scope&&a.status==="completed"?{...a,status:"reviewed",review:"Reviewed by fictional teacher"}:a));
  setFeedback("Fictional teacher review recorded in this browser session.");
 }
 function reset(){setAssignments(initial);setNextId(5);setFeedback("Demo reset.");}
 return <section className="sv-panel" aria-label="Fictional reading workflow">
  <h2>{school?"Classroom assignment and teacher review":"Family reading and guardian monitoring"}</h2>
  <p><strong>Interactive prototype:</strong> all identities, assignments, and learner names are fictional. State exists only in this open page and resets on reload. This is not a secure user account or actual permission enforcement.</p>
  <div className="sv-library-filters">
   <label>Sample {school?"school":"family"}<select value={scope} onChange={e=>{setScope(e.target.value as Scope);setFeedback("");}}>{scopeOptions[mode].map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
   <label>Simulated perspective<select value={role} onChange={e=>{setRole(e.target.value as typeof role);setFeedback("");}}>{school?<><option value="educator">Teacher / reviewer</option><option value="reader">Learner</option></>:<><option value="guardian">Guardian</option><option value="reader">Family reader</option></>}</select></label>
  </div>
  <div className="sv-grid">
   <article className="sv-card"><h3>Assigned</h3><p>{own.filter(a=>a.status==="assigned").length} sample tasks</p></article>
   <article className="sv-card"><h3>Completed</h3><p>{own.filter(a=>a.status==="completed").length} awaiting {school?"review":"guardian observation"}</p></article>
   <article className="sv-card"><h3>Reviewed</h3><p>{own.filter(a=>a.status==="reviewed").length} sample tasks</p></article>
  </div>
  {canAssign&&<div className="sv-panel"><h3>{school?"Assign a pilot story":"Plan a family story"}</h3><label htmlFor={`sv-workflow-${mode}-story`}>Choose story </label><select id={`sv-workflow-${mode}-story`} value={storySlug} onChange={e=>setStorySlug(e.target.value)} style={{padding:10,margin:8}}>{stories.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}</select><button type="button" onClick={add}>Add fictional assignment</button></div>}
  <h3>Reading activity for {scope.replace("-"," ").toUpperCase()}</h3>
  {own.length===0?<p>No sample assignments.</p>:<div className="sv-grid">{own.map(a=><article className="sv-card" key={a.id}>
   <span className="sv-tag">{a.status.toUpperCase()}</span><h3>{stories.find(s=>s.slug===a.storySlug)?.title??a.storySlug}</h3><p>{a.reader}</p>
   <p className="sv-muted">{a.review??(a.status==="completed"?"Completion awaiting review or monitoring":"Not yet completed")}</p>
   <Link href={`/${locale}/storyverse/read/${a.storySlug}`}>Open pilot story</Link>
   {canComplete&&a.status==="assigned"&&<p><button type="button" onClick={()=>complete(a.id)}>Simulate reading completion</button></p>}
   {canReview&&a.status==="completed"&&<p><button type="button" onClick={()=>review(a.id)}>Simulate teacher approval</button></p>}
  </article>)}</div>}
  {feedback&&<p role="status">{feedback}</p>}
  <p><button type="button" onClick={reset}>Reset fictional workflow</button></p>
  <p className="sv-muted">Scope switching filters only the demo records. Real isolation will require authenticated server checks, database RLS, guardian consent and audited reviews.</p>
 </section>;
}
