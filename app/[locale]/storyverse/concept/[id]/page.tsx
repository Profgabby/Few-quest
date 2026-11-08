import Link from "next/link";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n";
import {storyConcepts} from "@/lib/storyverse/theme-catalog";
import {StudioShell} from "@/components/storyverse/studio-shell";
export default async function Page({params}:{params:Promise<{locale:string,id:string}>}) {
 const {locale,id}=await params;
 if(!isLocale(locale))notFound();
 const concept=storyConcepts.find(c=>c.id===id);
 if(!concept)notFound();
 return <StudioShell locale={locale} title={concept.title} eyebrow={concept.theme}>
 <div className="sv-panel"><p className="sv-tag">{concept.tierName}</p><h2>Story synopsis</h2><p>{concept.summary}</p><p className="sv-muted">This story is in development. The full illustrated reading edition is not available yet.</p><Link href={`/${locale}/storyverse/library`}>← Back to Library</Link></div>
 <p><Link href={`/${locale}/storyverse`}>Return to StoryVerse Home</Link></p>
 </StudioShell>;
}
