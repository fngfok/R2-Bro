## 2026-04-05 - Optimizing Express Defaults
**Learning:** By default, Express reveals the server's fingerprint via the `X-Powered-By` header and does not cache EJS templates or static assets. Disabling `X-Powered-By` reduces byte-size and improves security. Explicitly enabling `view cache` ensures that template parsing only happens once, significantly improving render speed for frequently accessed pages. Setting a `maxAge` on static assets enables browser-side caching, dramatically reducing subsequent load times.
**Action:** Always verify Express defaults for headers and caching. Use `app.disable('x-powered-by')`, `app.set('view cache', true)`, and `maxAge` in `express.static` for immediate performance wins.
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
