import {IsolationDemo} from "@/components/storyverse/isolation-demo";
import {notFound} from "next/navigation";
import Link from "next/link";
import {isLocale} from "@/lib/i18n";
import {StudioShell,Notice,Panel} from "@/components/storyverse/studio-shell";
import {STORYVERSE_ROLES,capabilityMatrix,validateRoleMatrix} from "@/lib/storyverse/role-contract";
import {validateStoryCollectionPlan,storyCollectionPlan} from "@/lib/storyverse/theme-catalog";
export default async function Page({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const catalog=validateStoryCollectionPlan(),roles=validateRoleMatrix();
 return <StudioShell locale={locale} title="StoryVerse Development Readiness" eyebrow="OFFLINE VALIDATION">
 <Notice>This is a read-only development checklist. No account, school enrollment, database migration or authorization is activated by this page.</Notice>
 <Panel title="Catalog structure"><p>Categories: {catalog.themes} · Seed concepts: {catalog.seededConcepts} · Unique IDs: {catalog.uniqueConceptIds} · Original manuscript target: {catalog.target.toLocaleString("en-US")}</p><p role="status">Catalog integrity: {catalog.consistent?"PASS":"REVIEW REQUIRED"}</p><p>Per category: {storyCollectionPlan[0].tierTargets.map(t=>`Tier ${t.tier}: ${t.count}`).join(" · ")}</p></Panel>
 <Panel title="Role design"><p>{STORYVERSE_ROLES.length} planned roles. Role contract checks: {roles?"PASS":"REVIEW REQUIRED"}. These are design-level checks, not server authorization tests.</p>
 <div style={{overflowX:"auto"}}><table style={{width:"100%",textAlign:"left",borderCollapse:"collapse"}}><thead><tr><th scope="col">Role</th><th scope="col">Planned capabilities</th></tr></thead><tbody>{capabilityMatrix().map(item=><tr key={item.role}><th scope="row" style={{padding:"10px 12px",borderBottom:"1px solid #ddd"}}>{item.role.replaceAll("_"," ")}</th><td style={{padding:"10px 12px",borderBottom:"1px solid #ddd"}}>{item.capabilities.join(" · ").replaceAll("_"," ")}</td></tr>)}</tbody></table></div></Panel>
 <Panel title="Simulated school and family isolation"><IsolationDemo/></Panel>
 <Panel title="Release gates"><ol><li>Verify a dedicated, approved development database or local PostgreSQL environment.</li><li>Review schema and RLS policies; do not apply them to FEW Quest production.</li><li>Test signed-in user ownership and cross-school/cross-family denial.</li><li>Review minor safeguarding and consent requirements.</li><li>Verify real authentication, published-story filtering, accessibility and regression tests.</li></ol><Link href={`/${locale}/storyverse/school`}>Return to School StoryVerse →</Link></Panel>
 </StudioShell>;
}
