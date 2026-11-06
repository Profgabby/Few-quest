"use client";
import Link from "next/link";
import {useState} from "react";
import {demoActors,demoRecords,demoCanRead,type DemoActor} from "@/lib/storyverse/isolation-demo";
import {canPreviewCapability} from "@/lib/storyverse/role-contract";
import {storyThemes,STORY_COLLECTION_TARGET} from "@/lib/storyverse/theme-catalog";
type Mode="school"|"community";
const modeActors=(mode:Mode)=>demoActors.filter(a=>mode==="school"?!!a.organizationId:!a.organizationId);
export function ExperienceDashboard({locale,mode}:{locale:string;mode:Mode}){
 const options=modeActors(mode);
 const [actorId,setActorId]=useState(options[0].id);
 const actor:DemoActor=options.find(a=>a.id===actorId)??options[0];
 const visible=demoRecords.filter(r=>demoCanRead(actor,r));
 const privateRecords=visible.filter(r=>r.kind!=="public_story");
 const isSchool=mode==="school";
 const actions=isSchool?[
  {title:"Classroom assignments",description:"Review fictional assignment records visible to this sample school.",cap:"assign_school_stories" as const},
  {title:"Reading progress",description:"Review fictional classroom progress scoped to this sample school.",cap:"review_school_progress" as const},
  {title:"School administration",description:"Membership and teacher management design; no real enrollments.",cap:"manage_school_memberships" as const}
 ]:[
  {title:"Personal reading",description:"Continue with the three available pilot stories. Guest progress is stored on this device.",cap:"read_published" as const},
  {title:"Family reading",description:"Guardian planning and fictional family-scoped records.",cap:"manage_guarded_readers" as const},
  {title:"Community groups",description:"Reading-circle management design; no real memberships.",cap:"manage_community_groups" as const}
 ];
 return <section aria-label={isSchool?"School dashboard demonstration":"Community dashboard demonstration"}>
  <div className="sv-panel"><p><strong>DEMONSTRATION ONLY — fictional users and records.</strong> Selecting a role changes the example interface, not your identity or permissions. No accounts, children, classes, or private records are stored or fetched.</p>
   <label htmlFor={`sv-${mode}-actor`}>Explore as a simulated {isSchool?"school user":"community user"} </label>
   <select id={`sv-${mode}-actor`} value={actor.id} onChange={e=>setActorId(e.target.value)} style={{padding:12,margin:"8px 0",maxWidth:"100%"}}>{options.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}</select>
   <p className="sv-muted">Simulated role: {actor.role.replaceAll("_"," ")}{actor.organizationId?` · ${actor.organizationId}`:""}{actor.familyId?` · ${actor.familyId}`:""}</p>
  </div>
  <div className="sv-grid">
   <article className="sv-card"><span className="sv-tag">Shared collection</span><h2>{storyThemes.length} categories</h2><p>{STORY_COLLECTION_TARGET.toLocaleString("en-US")} planned stories, three reading tiers; three readable pilot manuscripts.</p></article>
   <article className="sv-card"><span className="sv-tag">Fictional records</span><h2>{privateRecords.length} visible</h2><p>Only records allowed by this illustrative role-and-scope model are listed below.</p></article>
   <article className="sv-card"><span className="sv-tag">Access model</span><h2>{isSchool?"School-scoped":"Reader-scoped"}</h2><p>{isSchool?"Sample School A and B are separate.":"Sample Family A and B are separate."} This is not database security.</p></article>
  </div>
  <h2>{isSchool?"School workspace":"Individual, Family & Community workspace"}</h2>
  <div className="sv-grid">{actions.map(action=><article className="sv-card" key={action.title}>
   <h3>{action.title}</h3><p>{action.description}</p>
   <p className="sv-muted">{canPreviewCapability(actor.role,action.cap)?"Available in role design · preview only":"Not included for selected role"}</p>
  </article>)}</div>
  <section className="sv-panel"><h2>Records visible to this fictional user</h2>
   <ul>{visible.map(r=><li key={r.id}>{r.label} <small>({r.kind.replaceAll("_"," ")})</small></li>)}</ul>
   <p className="sv-muted">Records from other organizations or families are excluded by the simulated read policy. This interface cannot create or edit records.</p>
  </section>
  <div className="sv-actions"><Link className="sv-button" href={`/${locale}/storyverse/library`}>Open shared story library</Link>
   <Link className="sv-button alt" href={`/${locale}/storyverse/readiness`}>Review isolation checks</Link>
   {!isSchool&&<Link className="sv-button" href={`/${locale}/storyverse/family`}>Family reading planner</Link>}</div>
 </section>;
}
