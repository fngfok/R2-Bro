# ⚡ Bolt's Journal - Performance Optimization

Critical learnings and findings related to performance in R2 Bro.

## 2025-05-15 - Initial Performance Audit
**Learning:** The application lacks basic production-ready optimizations such as EJS view caching and browser-side caching for static assets. The `X-Powered-By` header is also enabled, adding unnecessary bytes to every response.
**Action:** Implement `app.set('view cache', true)`, `app.disable('x-powered-by')`, and `maxAge` for `express.static`.
## 2026-04-03 - [EJS Template Caching]
**Learning:** Enabling `view cache` in Express for EJS templates provides a measurable performance boost by avoiding repeated disk reads and parsing of the same templates across requests. Even in small applications, this can reduce average response time and significantly improve P95 latency.
**Action:** Always consider enabling template caching in production environments or when high performance is a priority. Use `app.set('view cache', true)` for Express applications.
