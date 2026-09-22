"use client";
import {useState} from "react";

const classesByLevel: Record<string,string[]> = {
  Nursery:["Nursery 1","Nursery 2","Nursery 3"],
  Primary:["Primary 1","Primary 2","Primary 3","Primary 4","Primary 5","Primary 6"],
  JSS:["JSS 1","JSS 2","JSS 3"],
  SSS:["SSS 1","SSS 2","SSS 3"],
};

export function CompetitorForm({locale}:{locale:string}){
  const [state,setState]=useState("");
  const [busy,setBusy]=useState(false);
  const [schoolLevel,setSchoolLevel]=useState("");

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); if(busy)return;
    const form=e.currentTarget,fd=new FormData(form),controller=new AbortController(),timeout=window.setTimeout(()=>controller.abort(),20000);
    setBusy(true);setState("Adding competitor…");
    try{
      const quests=["growmeal","growenergy","growaqua"].filter(q=>fd.get(q)==="on");
      const response=await fetch("/api/school/competitors",{method:"POST",credentials:"same-origin",cache:"no-store",headers:{"content-type":"application/json"},body:JSON.stringify({displayName:fd.get("displayName"),schoolLevel:fd.get("schoolLevel"),classLevel:fd.get("classLevel"),ageCategory:fd.get("ageCategory"),questEligibility:quests}),signal:controller.signal});
      const raw=await response.text();let result:any={};try{result=raw?JSON.parse(raw):{}}catch{}
      if(!response.ok){setState(result.message||result.error||"Could not add competitor. Please try again.");return}
      form.reset();setSchoolLevel("");setState("Competitor added. Updating roster…");window.location.assign("/"+locale+"/school/competitors?updated="+Date.now());
    }catch(error:any){setState(error?.name==="AbortError"?"The request took too long and was stopped. Please try again.":"Could not reach the competitor service. Please refresh and try again.")}
    finally{window.clearTimeout(timeout);setBusy(false)}
  }

  const classChoices=classesByLevel[schoolLevel]||[];
  return <form className="team-form" onSubmit={submit}>
    <label>Learner name<input name="displayName" required minLength={2} disabled={busy}/></label>
    <label>School level<select name="schoolLevel" required value={schoolLevel} onChange={e=>setSchoolLevel(e.target.value)} disabled={busy}>
      <option value="" disabled>Select level</option><option>Nursery</option><option>Primary</option><option>JSS</option><option>SSS</option>
    </select></label>
    <label>Class / grade<select name="classLevel" required defaultValue="" key={schoolLevel||"none"} disabled={busy||!schoolLevel}>
      <option value="" disabled>{schoolLevel?"Select class / grade":"Select school level first"}</option>
      {classChoices.map(c=><option key={c} value={c}>{c}</option>)}
    </select></label>
    <label>Age category<input name="ageCategory" placeholder="e.g. 9–11 years" disabled={busy}/></label>
    <fieldset><legend>Quest eligibility</legend>
      <label><input type="checkbox" name="growmeal"/> GrowMeal</label>
      <label><input type="checkbox" name="growenergy"/> GrowEnergy / GrowVolt</label>
      <label><input type="checkbox" name="growaqua"/> GrowAqua</label>
    </fieldset>
    <button className="btn" type="submit" disabled={busy}>{busy?"Adding competitor…":"Add competitor"}</button>
    {state&&<p role="status" aria-live="polite">{state}</p>}
  </form>
}
