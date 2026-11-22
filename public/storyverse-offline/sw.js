const CACHE="sv-book-library-shell-v1";
const SHELL="/storyverse-offline/";
self.addEventListener("install",event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.add(SHELL);await self.skipWaiting();})()));
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("fetch",event=>{
 const u=new URL(event.request.url);
 if(event.request.method!=="GET"||u.origin!==self.location.origin||!u.pathname.startsWith("/storyverse-offline/"))return;
 if(u.pathname==="/storyverse-offline/"||u.pathname==="/storyverse-offline/index.html"){
  event.respondWith((async()=>{const cached=await caches.match(SHELL);return cached||fetch(event.request);})());
 }
});
