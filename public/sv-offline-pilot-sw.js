const CACHE="sv-offline-pilot-shell-v2";
const PILOT_PATH=/^\/[a-z]{2}(?:-[A-Za-z]{2})?\/storyverse\/offline-pilot\/?$/;
self.addEventListener("install",event=>event.waitUntil(self.skipWaiting()));
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("message",event=>{
 if(event.data?.type!=="SV_PILOT_DOWNLOAD")return;
 const port=event.ports?.[0];
 event.waitUntil((async()=>{
  try{
   const cache=await caches.open(CACHE);
   const urls=[...new Set(event.data.urls)].filter(url=>{
    const u=new URL(url,self.location.origin);
    return u.origin===self.location.origin&&(PILOT_PATH.test(u.pathname)||u.pathname.startsWith("/_next/static/")||u.pathname.startsWith("/storyverse/images/"));
   });
   if(!urls.some(url=>PILOT_PATH.test(new URL(url,self.location.origin).pathname)))throw Error("Pilot page missing");
   const pageUrl=urls.find(url=>PILOT_PATH.test(new URL(url,self.location.origin).pathname));
   const pageResponse=await fetch(pageUrl,{cache:"reload"});
   if(!pageResponse.ok)throw Error("Pilot HTML unavailable");
   const html=await pageResponse.clone().text();
   const assetPaths=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match=>match[1]).filter(path=>path.startsWith("/_next/static/")||path.startsWith("/storyverse/images/"));
   const all=[...new Set([...urls,...assetPaths.map(path=>new URL(path,self.location.origin).href)])];
   const responses=await Promise.all(all.map(async url=>{
     const response=url===pageUrl?pageResponse:await fetch(url,{cache:"reload"});
     if(!response.ok||response.type==="opaque")throw Error("Resource not cacheable: "+url);
     return [url,response];
   }));
   await Promise.all(responses.map(([url,response])=>cache.put(url,response)));
   const verified=await Promise.all(all.map(url=>cache.match(url)));
   if(verified.some(response=>!response))throw Error("Cache verification failed");
   port?.postMessage({ok:true,count:all.length});
  }catch(error){port?.postMessage({ok:false,error:String(error)});}
 })());
});
self.addEventListener("fetch",event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=="GET"||url.origin!==self.location.origin)return;
 if(PILOT_PATH.test(url.pathname)){
  event.respondWith((async()=>{
   try{const network=await fetch(event.request);if(network.ok){const cache=await caches.open(CACHE);await cache.put(event.request,network.clone());}return network;}
   catch{const cached=await caches.match(event.request,{ignoreSearch:true});return cached||Response.error();}
  })());return;
 }
 if(url.pathname.startsWith("/_next/static/")||url.pathname.startsWith("/storyverse/images/")){
  event.respondWith((async()=>{const cached=await caches.match(event.request);if(cached)return cached;const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);await cache.put(event.request,response.clone());}return response;})());
 }
});
