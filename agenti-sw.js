// Păstrează pagina în cache: pornește instant și se deschide și fără internet (cererile către Worker nu sunt interceptate)
const CACHE = "agenti-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
    const r = e.request;
    if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
    e.respondWith(caches.open(CACHE).then(async c => {
        const hit = await c.match(r);
        const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit || Response.error());
        return hit || net;
    }));
});
