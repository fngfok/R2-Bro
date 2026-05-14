# ⚡ Bolt's Journal - Performance Optimization

Critical learnings and findings related to performance in R2 Bro.

## 2025-05-15 - Initial Performance Audit
**Learning:** The application lacks basic production-ready optimizations such as EJS view caching and browser-side caching for static assets. The `X-Powered-By` header is also enabled, adding unnecessary bytes to every response.
**Action:** Implement `app.set('view cache', true)`, `app.disable('x-powered-by')`, and `maxAge` for `express.static`.

## 2026-04-03 - [EJS Template Caching]
**Learning:** Enabling `view cache` in Express for EJS templates provides a measurable performance boost by avoiding repeated disk reads and parsing of the same templates across requests. Even in small applications, this can reduce average response time and significantly improve P95 latency.
**Action:** Always consider enabling template caching in production environments or when high performance is a priority. Use `app.set('view cache', true)` for Express applications.

## 2026-04-18 - Instance Caching and Memoization
**Learning:** Caching raw API data still incurs the cost of class instantiation and property assignment (Object.assign) on every request. Additionally, searching through large arrays (like SWGOH profileStats) repeatedly is inefficient.
**Action:** Cache the fully instantiated Model objects instead of raw JSON. Implement memoization for expensive property lookups or calculations within the Model class to ensure O(1) access after the first call.

## 2026-05-10 - Concurrent Request Coalescing
**Learning:** High-concurrency environments can trigger "thundering herd" problems where multiple simultaneous requests for the same missing cache key result in redundant, expensive API calls.
**Action:** Use a `Map` of pending promises to coalesce concurrent requests for the same resource. Ensure the promise is removed from the map in a `finally` block to prevent stale "pending" states on failure. Using a single Map.get() lookup instead of has() + get() reduces hashing overhead.

## 2026-05-22 - Browser Caching for Dynamic Content
**Learning:** Adding 'Cache-Control' headers to dynamic routes (e.g., player profiles) allows browsers and CDNs to cache the response for a short period, drastically reducing server load and improving subsequent load times for the same user or other users behind the same cache.
**Action:** Use `res.setHeader('Cache-Control', 'public, max-age=300')` for relatively stable dynamic content.
