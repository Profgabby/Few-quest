import type {Locale} from "@/lib/i18n";
const messages={
en:{tagline:"Learn. Practice. Compete. Grow.",register:"Register your school",login:"School login",platform:"One platform for Food, Energy and Water learning competitions."},
ha:{tagline:"Koya. Yi atisaye. Yi gasa. Bunƙasa.",register:"Yi rajistar makaranta",login:"Shigar makaranta",platform:"Dandali guda don gasannin koyon Abinci, Makamashi da Ruwa."},
yo:{tagline:"Kọ́. Ṣe ìdánwò. Dije. Dàgbà.",register:"Forúkọsílẹ̀ ilé-ẹ̀kọ́",login:"Wọlé ilé-ẹ̀kọ́",platform:"Pẹpẹ kan fún ìdíje ẹ̀kọ́ Oúnjẹ, Agbára àti Omi."},
ig:{tagline:"Mụta. Mee omume. Sọrịta mpi. Too.",register:"Debanye ụlọ akwụkwọ",login:"Nbanye ụlọ akwụkwọ",platform:"Otu ikpo okwu maka asọmpi mmụta Nri, Ike na Mmiri."},
fr:{tagline:"Apprendre. S’exercer. Concourir. Grandir.",register:"Inscrire votre école",login:"Connexion école",platform:"Une plateforme pour les compétitions éducatives sur l’alimentation, l’énergie et l’eau."},
ar:{tagline:"تعلّم. تدرّب. تنافس. انمُ.",register:"سجّل مدرستك",login:"دخول المدرسة",platform:"منصة واحدة لمسابقات التعلّم في الغذاء والطاقة والمياه."}
} satisfies Record<Locale,Record<string,string>>;
export const getMessages=(l:Locale)=>messages[l];
