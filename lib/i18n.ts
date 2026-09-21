export const locales=["en","ha","yo","ig","fr","ar"] as const;
export type Locale=(typeof locales)[number];
export const localeNames:Record<Locale,string>={en:"English",ha:"Hausa",yo:"Yorùbá",ig:"Igbo",fr:"Français",ar:"العربية"};
export function isLocale(v:string):v is Locale{return locales.includes(v as Locale)}
export function direction(l:Locale){return l==="ar"?"rtl":"ltr"}
