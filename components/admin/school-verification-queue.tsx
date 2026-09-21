"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/browser";
import type {Messages} from "@/messages";

export type AdminSchool={id:string;school_code:string;name:string;school_type:string|null;state:string|null;lga:string|null;email:string|null;phone:string|null;status:string;created_at:string};

export function SchoolStatusList({schools,t,status}:{schools:AdminSchool[];t:Messages;status:"pending"|"verified"|"active"|"rejected"|"suspended"|"inactive"}){
 const router=useRouter();const [busy,setBusy]=useState("");const [error,setError]=useState("");
 async function change(id:string,next:"verified"|"active"|"rejected"|"suspended"|"inactive"|"pending"){
  let reason:string|null=null;
  if(["rejected","suspended","inactive"].includes(next)){reason=window.prompt("Reason is required:");if(!reason?.trim())return}
  setBusy(id+next);setError("");
  const {error}=await createClient().rpc("fewq_set_school_status",{p_school_id:id,p_status:next,p_reason:reason});
  if(error)setError(error.message);else router.refresh();setBusy("");
 }
 if(!schools.length)return <div className="empty-state">No schools in this section.</div>;
 return <div className="admin-list">{error&&<p className="form-error">{error}</p>}{schools.map(s=><article className="admin-school" key={s.id}><div><div className="eyebrow">{s.school_code}</div><h3>{s.name}</h3><p>{[s.school_type,s.lga,s.state].filter(Boolean).join(" • ")}</p><small>{s.email} {s.phone&&`• ${s.phone}`}</small></div><div className="admin-actions"><span className="status-pill">{s.status}</span>
 {status==="pending"&&<><button className="btn primary" disabled={!!busy} onClick={()=>change(s.id,"verified")}>{t.verify}</button><button className="btn danger" disabled={!!busy} onClick={()=>change(s.id,"rejected")}>{t.reject}</button></>}
 {status==="verified"&&<><button className="btn primary" disabled={!!busy} onClick={()=>change(s.id,"active")}>{t.activate}</button><button className="btn danger" disabled={!!busy} onClick={()=>change(s.id,"rejected")}>{t.reject}</button></>}
 {status==="active"&&<><button className="btn danger" disabled={!!busy} onClick={()=>change(s.id,"suspended")}>Suspend</button><button className="btn" disabled={!!busy} onClick={()=>change(s.id,"inactive")}>Make inactive</button></>}
 {status==="suspended"&&<><button className="btn primary" disabled={!!busy} onClick={()=>change(s.id,"active")}>Reactivate</button><button className="btn" disabled={!!busy} onClick={()=>change(s.id,"inactive")}>Make inactive</button></>}
 {status==="inactive"&&<button className="btn primary" disabled={!!busy} onClick={()=>change(s.id,"active")}>Reactivate</button>}
 {status==="rejected"&&<button className="btn" disabled={!!busy} onClick={()=>change(s.id,"pending")}>Return to review</button>}
 </div></article>)}</div>
}