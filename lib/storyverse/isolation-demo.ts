import {canPreviewCapability,type StoryVerseRole} from "./role-contract";
/** Fixed fictional data only. Never substitute for authenticated access or RLS. */
export type DemoActor={id:string;label:string;role:StoryVerseRole;organizationId?:string;familyId?:string};
export type DemoRecord={id:string;label:string;kind:"school_assignment"|"school_progress"|"family_progress"|"public_story";organizationId?:string;familyId?:string;ownerId?:string};
export const demoActors:DemoActor[]=[
 {id:"teacher-a",label:"Teacher · Sample School A",role:"teacher",organizationId:"school-a"},
 {id:"admin-a",label:"Administrator · Sample School A",role:"school_admin",organizationId:"school-a"},
 {id:"teacher-b",label:"Teacher · Sample School B",role:"teacher",organizationId:"school-b"},
 {id:"guardian-a",label:"Guardian · Sample Family A",role:"guardian",familyId:"family-a"},
 {id:"guardian-b",label:"Guardian · Sample Family B",role:"guardian",familyId:"family-b"},
 {id:"reader-a",label:"Independent Reader",role:"reader"},
 {id:"guest",label:"Guest",role:"guest"}
];
export const demoRecords:DemoRecord[]=[
 {id:"published",label:"Shared approved story · The Little Seed",kind:"public_story"},
 {id:"school-a-task",label:"School A · Classroom reading assignment",kind:"school_assignment",organizationId:"school-a",ownerId:"teacher-a"},
 {id:"school-b-task",label:"School B · Classroom reading assignment",kind:"school_assignment",organizationId:"school-b",ownerId:"teacher-b"},
 {id:"school-a-progress",label:"School A · Sample classroom progress",kind:"school_progress",organizationId:"school-a"},
 {id:"school-b-progress",label:"School B · Sample classroom progress",kind:"school_progress",organizationId:"school-b"},
 {id:"family-a-progress",label:"Family A · Sample reading progress",kind:"family_progress",familyId:"family-a"},
 {id:"family-b-progress",label:"Family B · Sample reading progress",kind:"family_progress",familyId:"family-b"}
];
export function demoCanRead(actor:DemoActor,record:DemoRecord):boolean{
 if(record.kind==="public_story")return canPreviewCapability(actor.role,"read_published");
 if(record.kind==="school_assignment")return !!actor.organizationId&&actor.organizationId===record.organizationId&&canPreviewCapability(actor.role,"assign_school_stories");
 if(record.kind==="school_progress")return !!actor.organizationId&&actor.organizationId===record.organizationId&&canPreviewCapability(actor.role,"review_school_progress");
 if(record.kind==="family_progress")return !!actor.familyId&&actor.familyId===record.familyId&&canPreviewCapability(actor.role,"manage_guarded_readers");
 return false;
}
export function demoCanEdit(actor:DemoActor,record:DemoRecord):boolean{
 if(record.kind==="school_assignment")return demoCanRead(actor,record)&&record.ownerId===actor.id;
 return false;
}
export function demoIsolationChecks(){
 const a=demoActors[0],b=demoActors[2],ga=demoActors[3],gb=demoActors[4],guest=demoActors[6];
 const record=(id:string)=>demoRecords.find(r=>r.id===id)!;
 return [
 {name:"School A teacher sees own assignment",passed:demoCanRead(a,record("school-a-task"))},
 {name:"School A teacher denied School B assignment",passed:!demoCanRead(a,record("school-b-task"))},
 {name:"School B teacher denied School A progress",passed:!demoCanRead(b,record("school-a-progress"))},
 {name:"Family A guardian sees own family progress",passed:demoCanRead(ga,record("family-a-progress"))},
 {name:"Family A guardian denied Family B progress",passed:!demoCanRead(ga,record("family-b-progress"))},
 {name:"Family B guardian denied Family A progress",passed:!demoCanRead(gb,record("family-a-progress"))},
 {name:"Guest denied school and family records",passed:demoRecords.filter(r=>r.kind!=="public_story").every(r=>!demoCanRead(guest,r))},
 {name:"All sample actors can read shared published story",passed:demoActors.every(actor=>demoCanRead(actor,record("published")))},
 {name:"School B teacher cannot edit School A assignment",passed:!demoCanEdit(b,record("school-a-task"))}
 ];
}
