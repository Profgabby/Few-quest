import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function POST(request:Request){
  try{
    const body=await request.json();
    const email=String(body?.email||"").trim();
    const password=String(body?.password||"");
    if(!email||!password)return NextResponse.json({error:"Email and password are required."},{status:400});

    const supabase=await createClient();
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error||!data.user){
      return NextResponse.json({error:error?.message||"Could not sign in."},{status:401});
    }

    // createClient writes the Supabase session cookies onto this response context.
    return NextResponse.json({ok:true,userId:data.user.id});
  }catch(error){
    console.error("FEW Quest login route failed",error);
    return NextResponse.json({error:"Could not sign in. Please try again."},{status:500});
  }
}
