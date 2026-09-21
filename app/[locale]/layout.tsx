import {notFound} from "next/navigation";
import {direction,isLocale} from "@/lib/i18n";
export default async function LocaleLayout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{locale:string}>}>){const {locale}=await params;if(!isLocale(locale))notFound();return <html lang={locale} dir={direction(locale)}><body>{children}</body></html>}
