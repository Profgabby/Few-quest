"use client";
import {FormEvent,useState} from "react";
import {getMessages} from "@/messages";
import type {Locale} from "@/lib/i18n";

const TIMEOUT_MS=15000;

export function LoginForm({locale}:{locale:Locale}){
  const t=getMessages(locale);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(busy)return;
    setBusy(true);
    setError("");
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),TIMEOUT_MS);
    try{
      const f=new FormData(e.currentTarget);
      const response=await fetch("/api/auth/login",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({email:String(f.get("email")||"").trim(),password:String(f.get("password")||"")}),
        signal:controller.signal,
        cache:"no-store",
      });
      const payload=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(payload.error||"Could not sign in. Please try again.");

      // Use a hard navigation so the next server request necessarily carries
      // the session cookie written by the server login endpoint.
      window.location.assign(`/${locale}/dashboard`);
    }catch(err){
      const message=err instanceof Error?err.message:"";
      setError(err instanceof DOMException&&err.name==="AbortError"
        ?"Sign-in took too long. Please try again."
        :(message||"Could not sign in. Please try again."));
      setBusy(false);
    }finally{
      clearTimeout(timer);
    }
  }

  return <form className="form-card" onSubmit={submit}>
    <label>{t.officialEmail}<input name="email" type="email" required autoComplete="email"/></label>
    <label>{t.password}<input name="password" type="password" required autoComplete="current-password"/></label>
    {error&&<p className="form-error">{error}</p>}
    <button className="btn primary" disabled={busy}>{busy?t.signingIn:t.signIn}</button>
  </form>
}
