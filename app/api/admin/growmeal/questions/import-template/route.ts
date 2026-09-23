import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const s=await createClient();
  const {data:{user}}=await s.auth.getUser();
  if(!user) return NextResponse.json({error:"Authentication required"},{status:401});
  const {data:role}=await s.from("fewq_platform_roles").select("role").eq("user_id",user.id).eq("active",true).in("role",["platform_admin","content_reviewer"]).maybeSingle();
  if(!role) return NextResponse.json({error:"Access denied"},{status:403});
  const csv=[
    "competition_category,class_level,garden_code,garden_domain,question_text,option_a,option_b,option_c,option_d,correct_option,explanation,difficulty,source_reference",
    'GM-NUR,Nursery 1,N01,Alphabet Garden,"Which letter begins the word plant?",P,B,T,S,A,"Plant begins with P.",foundation,GM-NUR-source'
  ].join("\n");
  return new NextResponse(csv,{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":'attachment; filename="growmeal-question-import-template.csv"'}});
}
