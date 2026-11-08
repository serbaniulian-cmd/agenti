// Pagina se ia mereu proaspătă de pe internet; din cache se folosește doar când nu ai internet
const CACHE = "agenti-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener("fetch", e => {
    const r = e.request;
    if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
    e.respondWith(
        fetch(r.url, { cache: "no-cache" })
            .then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(r.url, c)); } return res; })
            .catch(() => caches.match(r.url).then(h => h || Response.error()))
    );
});
