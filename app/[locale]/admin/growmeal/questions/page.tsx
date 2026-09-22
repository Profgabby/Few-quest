import {notFound,redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {isLocale} from "@/lib/i18n";
import {growMealCompetitionCategories} from "@/lib/competition/growmeal";
import {QuestionBankAdmin} from "@/components/admin/question-bank-admin";

export default async function GrowMealQuestionBankPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;if(!isLocale(locale))notFound();
 const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect(`/${locale}/login`);
 const {data:role}=await s.from("fewq_platform_roles").select("role").eq("user_id",user.id).eq("active",true).in("role",["platform_admin","content_reviewer"]).maybeSingle();
 if(!role)redirect(`/${locale}/dashboard`);
 const {data:questions}=await s.from("question_bank").select("*").eq("quest_family","GrowMeal").order("created_at",{ascending:false});
 return <main className="dashboard-shell"><section className="dashboard-head"><div className="eyebrow">GrowMeal • Question Bank</div><h1>Question Bank</h1><p className="lead">One approved bank for Practice, Timed Quiz, 100 Cards, Hot Seat and Live 50.</p><a className="btn" href={`/${locale}/admin`}>← FEW Quest HQ</a></section><section className="dashboard-section"><QuestionBankAdmin initialQuestions={questions??[]} categories={growMealCompetitionCategories}/></section></main>
}