## 2025-05-22 - Managing Lockfiles in Limited Environments
**Learning:** Running `pnpm install` in this environment generates a `pnpm-lock.yaml` file with >3700 lines. Including this in a PR violates line-count constraints and pollutes the review.
**Action:** Always delete `pnpm-lock.yaml` before submitting a PR unless explicit dependency changes are required and the lockfile is specifically requested.
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

## 2026-05-10 - Concurrent Request Coalescing
**Learning:** High-concurrency environments can trigger "thundering herd" problems where multiple simultaneous requests for the same missing cache key result in redundant, expensive API calls.
**Action:** Use a `Map` of pending promises to coalesce concurrent requests for the same resource. Ensure the promise is removed from the map in a `finally` block to prevent stale "pending" states on failure.

## 2026-05-15 - Lockfile Integrity and Environment Constraints
**Learning:** In projects with strict line-count constraints for PRs, the `pnpm-lock.yaml` can often exceed the limit. However, deleting it is a major regression that breaks build reproducibility.
**Action:** Always maintain the lockfile. If it is too large, consider atomic changes that don't trigger massive lockfile updates, or discuss the constraint with the team instead of deleting critical infrastructure.

## 2026-05-15 - Redundant Logic vs. Optimization
**Learning:** Refactoring existing performance logic is good for readability but might not count as a new optimization if the bottleneck was already addressed.
**Action:** Always check if an optimization pattern is already partially or fully implemented before starting. Focus on unaddressed bottlenecks like memoization of frequently accessed model properties.
