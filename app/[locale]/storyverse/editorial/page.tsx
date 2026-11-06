import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n";
import {StudioShell,Notice} from "@/components/storyverse/studio-shell";
import {EditorialStoryHolders} from "@/components/storyverse/editorial-story-holders";
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <StudioShell locale={locale} title="Story Catalog · Editorial Mockup" eyebrow="STORYVERSE CONTENT PLANNING"><Notice>Design-only story holders. No manuscripts are published, no editorial accounts are created, and no database is connected.</Notice><EditorialStoryHolders locale={locale}/></StudioShell>;}
