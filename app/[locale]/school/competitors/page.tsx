import {redirect,notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";
import {isLocale} from "@/lib/i18n";
import {CompetitorForm} from "@/components/school/competitor-form";
import {CompetitorAccessButton} from "@/components/school/competitor-access-button";
export const dynamic="force-dynamic"; export const revalidate=0;
export default async function Competitors({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/"+locale+"/login");
 const {data:mine}=await s.from("fewq_school_memberships").select("school_id,role,fewq_schools(name,status)").eq("user_id",user.id).eq("active",true);
 const admins=(mine||[]).filter((x:any)=>x.role==="school_admin"&&x.fewq_schools?.status==="active") as any[];if(admins.length!==1)redirect("/"+locale+"/school");
 const me=admins[0], admin=createAdminClient();
 const {data:roster,error}=await admin.from("fewq_competitors").select("id,competitor_code,display_name,school_level,class_level,age_category,quest_eligibility,active,authorization_status,created_at").eq("school_id",me.school_id).order("created_at",{ascending:true});
 return <main className="dashboard-shell"><section className="dashboard-head"><div><div className="eyebrow">Competitor roster</div><h1>{(me.fewq_schools as any)?.name||"School competitors"}</h1><p className="lead">Create learner competition records directly. Learners do not need login accounts.</p><a href={"/"+locale+"/school"}>← School control center</a></div></section>
 <section className="dashboard-section team-layout"><div className="control-panel"><h2>Add competitor</h2><p>Assign the learner to a class/age category and select the Quest programmes they may enter.</p><CompetitorForm locale={locale}/></div>
 <div className="control-panel"><div className="control-panel-head"><div><div className="eyebrow">Current roster</div><h2>{(roster||[]).length} {(roster||[]).length===1?"competitor":"competitors"}</h2></div></div>
 {error?<p role="alert">The competitor roster could not be loaded. Please refresh.</p>:!(roster||[]).length?<p>No competitors have been added yet.</p>:<div className="team-list">{(roster||[]).map((c:any)=><article className="team-row" key={c.id}><div><strong>{c.display_name}</strong><span>{c.competitor_code} • {c.school_level||"Level not set"} • {c.class_level||"Class not set"}{c.age_category?" • "+c.age_category:""}</span><span>{(c.quest_eligibility||[]).map((q:string)=>q==="growmeal"?"GrowMeal":q==="growenergy"?"GrowEnergy":"GrowAqua").join(" • ")||"No Quest selected"}</span></div><div className="team-row-actions"><span className="status-pill">{c.active?"Active":"Inactive"}</span><CompetitorAccessButton competitorId={c.id} active={c.active}/></div></article>)}</div>}</div></section></main>
}