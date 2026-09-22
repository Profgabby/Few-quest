"use client";
import {FormEvent,useState} from "react";
import {useRouter} from "next/navigation";
import {createClient} from "@/lib/supabase/browser";
import {getMessages} from "@/messages";
import type {Locale} from "@/lib/i18n";

const TIMEOUT_MS=15000;
async function withTimeout<T>(promise:Promise<T>):Promise<T>{
  return await Promise.race([
    promise,
    new Promise<T>((_,reject)=>setTimeout(()=>reject(new Error("REQUEST_TIMEOUT")),TIMEOUT_MS)),
  ]);
}

export function LoginForm({locale}:{locale:Locale}){
  const t=getMessages(locale);
  const router=useRouter();
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(busy)return;
    setBusy(true);
    setError("");
    try{
      const f=new FormData(e.currentTarget);
      const supabase=createClient();
      const email=String(f.get("email")||"").trim();
      const password=String(f.get("password")||"");
      const result=await withTimeout(supabase.auth.signInWithPassword({email,password}));
      if(result.error)throw result.error;

      // Authentication succeeded. Dashboard performs authoritative role routing.
      // Admin claiming and pending school registration must never block sign-in.
      router.replace(`/${locale}/dashboard`);
      router.refresh();
    }catch(err){
      const message=err instanceof Error?err.message:"";
      setError(message==="REQUEST_TIMEOUT"
        ?"Sign-in took too long. Please try again."
        :(message||"Could not sign in. Please try again."));
      setBusy(false);
    }
  }

  return <form className="form-card" onSubmit={submit}>
    <label>{t.officialEmail}<input name="email" type="email" required autoComplete="email"/></label>
    <label>{t.password}<input name="password" type="password" required autoComplete="current-password"/></label>
    {error&&<p className="form-error">{error}</p>}
    <button className="btn primary" disabled={busy}>{busy?t.signingIn:t.signIn}</button>
  </form>
}