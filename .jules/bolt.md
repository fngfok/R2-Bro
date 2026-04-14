## 2026-04-03 - [EJS Template Caching]
**Learning:** Enabling `view cache` in Express for EJS templates provides a measurable performance boost by avoiding repeated disk reads and parsing of the same templates across requests. Even in small applications, this can reduce average response time and significantly improve P95 latency.
**Action:** Always consider enabling template caching in production environments or when high performance is a priority. Use `app.set('view cache', true)` for Express applications.
