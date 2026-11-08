import {StoryVerseAsset,StoryVerseVisuals} from "@/components/storyverse/visual-assets";
import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n";
import {stories} from "@/lib/storyverse/catalog";
import {StoryLibrary} from "@/components/storyverse/story-library";
import {StudioShell} from "@/components/storyverse/studio-shell";
export default async function Page({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{level?:string}>}){const {locale}=await params;const {level}=await searchParams;if(!isLocale(locale))notFound();return <StudioShell locale={locale} title="Discover Your Next Great Story" eyebrow="STORYVERSE LIBRARY"><StoryVerseAsset name="library-hero" hero alt="StoryVerse library"/><StoryVerseVisuals items={[{name:"library-worlds",title:"Discover story worlds",alt:"Story worlds illustration"},{name:"library-levels",title:"Choose a reading level",alt:"Reading levels illustration"}]}/><p className="sv-lead">Explore stories about nature, science, family, culture, adventure, and more. Find a story that matches your interests and reading level.</p><StoryLibrary stories={stories} locale={locale} initialLevel={level}/></StudioShell>;}
