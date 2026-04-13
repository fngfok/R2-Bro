## 2026-04-13 - Redundant View Caching in Production
**Learning:** Express automatically enables EJS view caching when `NODE_ENV` is set to `production`. Explicitly setting `app.set('view cache', true)` is redundant in these environments.
**Action:** Focus on other production-specific optimizations like `maxAge` for static assets, and omit redundant default framework optimizations to keep the codebase clean.
