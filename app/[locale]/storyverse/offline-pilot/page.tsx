import {notFound} from "next/navigation";
import {isLocale} from "@/lib/i18n";
import {StudioShell,Notice} from "@/components/storyverse/studio-shell";
import {OfflinePilot} from "@/components/storyverse/offline-pilot";
export default async function Page({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 return <StudioShell locale={locale} title="Offline Reading Laboratory" eyebrow="STORYVERSE · SV-M2 TEST ONLY">
 <Notice>Experimental offline test. This original story is not a published book and no paid entitlements are active.</Notice>
 <OfflinePilot locale={locale}/>
 </StudioShell>;
}