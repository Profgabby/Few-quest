import Link from "next/link";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n";
import {StudioShell,Notice} from "@/components/storyverse/studio-shell";

const plans=[
 {name:"Free",price:"$0",period:"forever",audience:"Try StoryVerse",features:["Selected editorially approved free stories","Basic comprehension activities","Local reading progress","Introductory reading challenges"]},
 {name:"Plus",price:"$3.99",period:"per month",audience:"Individual readers",features:["Approved standard story library","Expanded learning activities","Selected licensed offline downloads","Premium narration when available"]},
 {name:"Family",price:"$7.99",period:"per month",audience:"Households",features:["Up to five managed reader profiles","Plus reading benefits","Guardian dashboard and reports","Family reading challenges"]},
 {name:"Schools",price:"From $99",period:"per year (pilot hypothesis)",audience:"Teachers and schools",features:["Seat-limited classroom access","Teacher assignments and reports","School reading activities","Managed offline reading packs"]}
] as const;
export default async function Page({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;if(!isLocale(locale))notFound();
 return <StudioShell locale={locale} title="Reading Plans" eyebrow="STORYVERSE · PRICING PROTOTYPE">
 <Notice>Development-only pricing preview. No subscriptions, checkout, paid entitlements or account upgrades are active. Prices are research hypotheses, not offers.</Notice>
 <p className="sv-lead">Choose how you might read, listen, learn and create. Final plans will depend on reader feedback, approved content and sustainable operating costs.</p>
 <div className="sv-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
 {plans.map(plan=><article className="sv-card" key={plan.name} style={{padding:22,display:"flex",flexDirection:"column",gap:12}}>
 <span className="sv-tag">{plan.audience}</span><h2 style={{margin:0}}>{plan.name}</h2><p style={{margin:0,fontSize:26,fontWeight:800}}>{plan.price} <small style={{fontSize:13,fontWeight:400}}>{plan.period}</small></p>
 <ul style={{paddingLeft:20,flex:1}}>{plan.features.map(feature=><li key={feature} style={{marginBottom:9}}>{feature}</li>)}</ul>
 <span aria-label={plan.name+" is not yet available"} style={{display:"block",padding:12,border:"1px solid #b7c9bc",borderRadius:10,textAlign:"center",color:"#4c6052"}}>Coming later · no checkout</span>
 </article>)}</div>
 <section className="sv-panel"><h2>Access with or without internet</h2><p>Online reading will support discovery, account services and live learning. Selected approved and licensed books may be downloadable for offline reading when that feature is implemented. Offline access is not yet available.</p></section>
 <p><Link href={`/${locale}/storyverse/ecosystem`}>Explore the StoryVerse services →</Link></p>
 </StudioShell>;
}