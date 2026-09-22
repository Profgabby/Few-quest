"use client";
import {FormEvent,useState} from "react";
import {getMessages} from "@/messages";
import type {Locale} from "@/lib/i18n";
import {createClient} from "@/lib/supabase/browser";

export function LoginForm({locale}:{locale:Locale}){
  const t=getMessages(locale);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(busy)return;
    setBusy(true);
    setError("");
    try{
      const f=new FormData(e.currentTarget);
      const email=String(f.get("email")||"").trim();
      const password=String(f.get("password")||"");
      const supabase=createClient();
      const {data,error:authError}=await supabase.auth.signInWithPassword({email,password});
      if(authError||!data.session)throw new Error(authError?.message||"Could not sign in. Please try again.");

      // Browser Supabase auth persists the session locally/cookies via the SSR client.
      // Hard navigation lets the server dashboard read the newly established session.
      window.location.assign(`/${locale}/dashboard`);
    }catch(err){
      setError(err instanceof Error?err.message:"Could not sign in. Please try again.");
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
