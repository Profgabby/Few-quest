"use client";
import {useState} from "react";
import {demoActors,demoRecords,demoCanRead,demoCanEdit,demoIsolationChecks} from "@/lib/storyverse/isolation-demo";
export function IsolationDemo(){
 const [actorId,setActorId]=useState(demoActors[0].id);
 const actor=demoActors.find(a=>a.id===actorId)!;
 const checks=demoIsolationChecks();
 return <section aria-label="Fictional account isolation demonstration">
  <p><strong>Simulated identities only.</strong> Choose a fictional user to inspect which records the model permits. No sign-in, database, or actual private records are involved.</p>
  <label htmlFor="sv-demo-actor">Simulated user </label>
  <select id="sv-demo-actor" value={actorId} onChange={e=>setActorId(e.target.value)} style={{padding:10,margin:"8px 0 16px",maxWidth:"100%"}}>{demoActors.map(a=><option value={a.id} key={a.id}>{a.label}</option>)}</select>
  <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}><thead><tr><th scope="col">Fictional record</th><th scope="col">Read</th><th scope="col">Edit</th></tr></thead><tbody>{demoRecords.map(record=><tr key={record.id}><th scope="row" style={{padding:10,borderBottom:"1px solid #ddd"}}>{record.label}</th><td style={{padding:10,borderBottom:"1px solid #ddd"}}>{demoCanRead(actor,record)?"Allowed":"Denied"}</td><td style={{padding:10,borderBottom:"1px solid #ddd"}}>{demoCanEdit(actor,record)?"Allowed":"Denied"}</td></tr>)}</tbody></table></div>
  <h3>Deterministic negative checks</h3><p role="status">{checks.filter(c=>c.passed).length} of {checks.length} model checks passing.</p>
  <ul>{checks.map(c=><li key={c.name}>{c.passed?"PASS":"FAIL"} — {c.name}</li>)}</ul>
  <p><small>These checks validate only a pure TypeScript model. They do not verify real database RLS, account authentication, consent, or production security.</small></p>
 </section>;
}
