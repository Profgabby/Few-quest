import Link from "next/link";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n";
import {StudioShell,Notice,Panel} from "@/components/storyverse/studio-shell";
import {storyThemes,STORY_COLLECTION_TARGET} from "@/lib/storyverse/theme-catalog";
export default async function Page({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 return <StudioShell locale={locale} title="School StoryVerse" eyebrow="SCHOOL READING ENVIRONMENT">
 <p className="sv-lead">A dedicated school entry point to the shared StoryVerse collection, designed for teachers, classrooms, school leaders and learners.</p>
 <Notice>This is a school-experience preview, not an authenticated school dashboard. Class enrollment, teacher assignments, pupil records and school analytics are not active.</Notice>
 <div className="sv-grid">
 <article className="sv-card"><h2>Teachers and classrooms</h2><p>Browse stories by reading tier and theme. Curriculum mapping and secure assignments are planned.</p><Link className="sv-button" href={`/${locale}/storyverse/library`}>Explore shared library</Link></article>
 <article className="sv-card"><h2>School reading clubs</h2><p>Discover reading material for group discussion and enrichment. No student records are collected in this preview.</p><Link className="sv-button alt" href={`/${locale}/storyverse/library`}>Browse stories</Link></article>
 <article className="sv-card"><h2>Story creators and educators</h2><p>Prepare private story drafts for future editorial review. Drafts are not published automatically.</p><Link className="sv-button" href={`/${locale}/storyverse/creator`}>Open Creator Studio</Link></article>
 </div>
 <Panel title="One shared story collection"><p>{storyThemes.length} categories · {STORY_COLLECTION_TARGET.toLocaleString("en-US")} planned original stories · Little Explorers, Story Adventurers and Master Storytellers.</p><p>School grade and curriculum alignment will be separate from reading difficulty. The school and community experiences will share approved manuscripts without sharing private user records.</p></Panel>
 </StudioShell>;
}
