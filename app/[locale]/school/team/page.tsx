import {redirect,notFound} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";
import {isLocale} from "@/lib/i18n";
import {LanguageSwitcher} from "@/components/language-switcher";
import {LogoutButton} from "@/components/auth/logout-button";
import {TeamInviteForm} from "@/components/school/team-invite-form";
import {TeamAccessButton} from "@/components/school/team-access-button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Team({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!isLocale(locale))notFound();

  const s=await createClient();
  const {data:{user}}=await s.auth.getUser();
  if(!user)redirect("/"+locale+"/login");

  const {data:mine}=await s
    .from("fewq_school_memberships")
    .select("school_id,role,fewq_schools(name,status)")
    .eq("user_id",user.id)
    .eq("active",true);

  const admins=(mine||[]).filter((x:any)=>x.role==="school_admin"&&x.fewq_schools?.status==="active") as any[];
  if(admins.length!==1)redirect("/"+locale+"/school");

  const me=admins[0];
  const admin=createAdminClient();

  // Fetch memberships first, then profiles separately. This avoids relying on
  // PostgREST's embedded relationship inference for the user_id -> profile FK.
  const {data:memberships,error:membershipError}=await admin
    .from("fewq_school_memberships")
    .select("id,user_id,role,active,created_at")
    .eq("school_id",me.school_id)
    .in("role",["teacher","competitor_manager"])
    .order("created_at",{ascending:true});

  const userIds=(memberships||[]).map((m:any)=>m.user_id);
  let profiles:any[]=[];
  let profileError:any=null;
  if(userIds.length){
    const profileResult=await admin
      .from("fewq_profiles")
      .select("id,full_name,preferred_language")
      .in("id",userIds);
    profiles=profileResult.data||[];
    profileError=profileResult.error;
  }

  const profileById=new Map(profiles.map((p:any)=>[p.id,p]));
  const team=(memberships||[]).map((m:any)=>({...m,profile:profileById.get(m.user_id)||null}));
  const teamError=membershipError||profileError;

  return <main className="dashboard-shell">
    <nav className="nav"><a className="brand" href={"/"+locale+"/school"}>LIFEWS • FEW QUEST</a><div className="nav-tools"><LanguageSwitcher locale={locale}/><LogoutButton locale={locale}/></div></nav>
    <section className="dashboard-head"><div><div className="eyebrow">Teachers & team</div><h1>{(me.fewq_schools as any)?.name||"School team"}</h1><p className="lead">Create staff accounts, assign operational roles and control school access.</p><a href={"/"+locale+"/school"}>← School control center</a></div></section>
    <section className="dashboard-section team-layout">
      <div className="control-panel"><h2>Add team member</h2><p>Add a teacher or competitor manager directly. No school invitation acceptance is required.</p><TeamInviteForm locale={locale}/></div>
      <div className="control-panel">
        <div className="control-panel-head"><div><div className="eyebrow">Current team</div><h2>{team.length} {team.length===1?"member":"members"}</h2></div></div>
        {teamError?<p role="alert">The team list could not be loaded. Please refresh the page.</p>:
        team.length===0?<p>No teachers or competitor managers have been added yet.</p>:
        <div className="team-list">{team.map((m:any)=><article className="team-row" key={m.id}>
          <div><strong>{m.profile?.full_name||"Team member"}</strong><span>{String(m.role).replaceAll("_"," ")} • {m.profile?.preferred_language||"en"}</span></div>
          <div className="team-row-actions"><span className="status-pill">{m.active?"Active":"Inactive"}</span><TeamAccessButton membershipId={m.id} active={m.active}/></div>
        </article>)}</div>}
      </div>
    </section>
  </main>
}