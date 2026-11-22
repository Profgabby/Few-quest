import Link from "next/link";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n";
import {StudioShell,Notice} from "@/components/storyverse/studio-shell";

const modules=[
 {name:"Read",icon:"📖",description:"Find stories, follow your reading journey and answer comprehension questions.",status:"Existing reader available in editorial preview"},
 {name:"Listen",icon:"🎧",description:"Planned narrated stories, read-along highlighting, speed controls and selected audio downloads.",status:"Planned"},
 {name:"Learn",icon:"🎓",description:"Planned vocabulary, comprehension, reading pathways and optional pronunciation activities.",status:"Planned"},
 {name:"Create",icon:"✍️",description:"Planned private guided story drafting and illustration tools with editorial safeguarding.",status:"Planned"},
 {name:"Challenges",icon:"🏆",description:"Planned reading missions, badges, classroom activities and moderated competitions.",status:"Planned"},
 {name:"Offline",icon:"⬇️",description:"Planned downloadable licensed books, local progress and safe synchronization.",status:"Planned"}
] as const;
const services=[
 ["StoryVerse Listen","Audiobooks and narration"],
 ["StoryVerse Read & Learn","Literacy development and assessment"],
 ["StoryVerse Create","Young Authors Studio"],
 ["StoryVerse Classroom","Teacher and school workspace"],
 ["StoryVerse Languages","Reviewed multilingual and parallel-language stories"],
 ["StoryVerse Reading League","Reading challenges and competitions"],
 ["StoryVerse Marketplace","Future curated publishing and book sales"]
] as const;
export default async function Page({params}:{params:Promise<{locale:string>}) {
 const {locale}=await params;if(!isLocale(locale))notFound();
 return <StudioShell locale={locale} title="Explore the StoryVerse Experience" eyebrow="STORYVERSE · ECOSYSTEM PROTOTYPE">
 <Notice>Development preview: service cards describe the product roadmap. They are not active subscriptions or operational features.</Notice>
 <h2>Six reader experiences</h2>
 <div className="sv-grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))"}}>{modules.map(module=><article className="sv-card" key={module.name} style={{padding:20}}>
 <span aria-hidden="true" style={{fontSize:32}}>{module.icon}</span><h3>{module.name}</h3><p>{module.description}</p><small className="sv-muted">{module.status}</small>
 </article>)}</div>
 <section className="sv-panel"><h2>Seven complementary services</h2><div className="sv-grid">{services.map(([name,description])=><article className="sv-card" key={name} style={{padding:16}}><h3>{name}</h3><p>{description}</p><small className="sv-muted">Roadmap · not launched</small></article>)}</div></section>
 <section className="sv-panel"><h2>For families, schools and creators</h2><p>Guardian-managed profiles, classroom assignments, and LIFEWS-reviewed publishing will be introduced in later phases with privacy, safety and editorial controls.</p></section>
 <p><Link href={`/${locale}/storyverse/plans`}>Compare proposed reading plans →</Link> · <Link href={`/${locale}/storyverse/library`}>Return to existing story library →</Link></p>
 </StudioShell>;
}