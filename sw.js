/* Radi bez interneta: cela aplikacija (jedan HTML sa svim pitanjima), fontovi i ikonice se čuvaju na telefonu.
   Nova verzija se preuzme u pozadini, a aplikacija ponudi „Osveži”. */
const CACHE = "drzavni-ispit-5eb809226e";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./fonts/fonts.css", "./fonts/JetBrainsMono-cyrillic-b1b041.woff2", "./fonts/JetBrainsMono-cyrillic-ext-27e1b5.woff2", "./fonts/JetBrainsMono-latin-480c06.woff2", "./fonts/JetBrainsMono-latin-ext-ba1653.woff2", "./fonts/Onest-cyrillic-4c7562.woff2", "./fonts/Onest-cyrillic-ext-992f92.woff2", "./fonts/Onest-latin-cebbb5.woff2", "./fonts/Onest-latin-ext-27cee5.woff2", "./fonts/Unbounded-cyrillic-c86556.woff2", "./fonts/Unbounded-cyrillic-ext-67e1db.woff2", "./fonts/Unbounded-latin-06f2e4.woff2", "./fonts/Unbounded-latin-ext-80da0c.woff2", "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data === "skip") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(caches.match("./index.html").then(c => c || fetch(r)));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(c => c || fetch(r).then(res => {
    if (res.ok && res.type === "basic") { const cl = res.clone(); caches.open(CACHE).then(k => k.put(r, cl)); }
    return res;
  })));
});
