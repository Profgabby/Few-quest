import {writeFileSync} from 'node:fs';
const base=`http://127.0.0.1:${process.env.PORT||3107}`;
const routes=['/en','/en/login','/en/register','/en/school','/en/teacher','/en/admin','/en/storyverse'];
const results=[];
for(const path of routes){
 try{const r=await fetch(base+path,{redirect:'manual'});const html=await r.text();const ok=[200,302,303,307,308,401,403].includes(r.status)&&!html.includes('Internal Server Error');results.push({path,status:r.status,ok,bytes:html.length,redirect:r.headers.get('location')});}
 catch(e){results.push({path,ok:false,error:String(e)})}
}
const page=await fetch(base+'/en/storyverse');const body=await page.text();
const storyverseRendered=page.status===200&&/StoryVerse/i.test(body);
results.push({path:'/en/storyverse content',ok:storyverseRendered});
writeFileSync('qa/results/http-regression.json',JSON.stringify(results,null,2));
for(const r of results)console.log(`${r.ok?'PASS':'FAIL'} ${r.path} ${r.status??''}`);
if(results.some(x=>!x.ok))process.exitCode=1;
