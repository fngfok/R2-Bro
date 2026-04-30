## 2026-04-01 - [Ally Code Validation & Security Headers]
**Vulnerability:** Lack of input validation on `allyCode` allowed for potential path traversal and redirect manipulation. Absence of security headers left the app vulnerable to MIME-sniffing and clickjacking.
**Learning:** Even simple numeric inputs like SWGOH ally codes can be vectors for injection if not strictly validated against a regex pattern. Re-implementing app logic in tests was a mistake; refactoring `app.js` to export the `app` instance is the proper way to enable robust integration testing.
**Prevention:** Always validate user input at the route level using strict regex. Implement standard security headers as a base layer of defense.

## 2026-04-02 - [Payload Size Limits & Modernized Headers]
**Vulnerability:** Default Express configurations for `json` and `urlencoded` parsers lack body size limits, exposing the application to Denial of Service (DoS) attacks via large payloads. Legacy `X-XSS-Protection` headers can sometimes be bypassed or even used to create vulnerabilities.
**Learning:** Modernizing security headers involves moving away from legacy filters (setting `X-XSS-Protection: 0`) in favor of a strong `Content-Security-Policy`. Explicitly limiting payload sizes (e.g., `10kb`) is a simple but effective defense against memory-exhaustion DoS.
**Prevention:** Always set explicit `limit` options on body parsers. Use CSP as the primary defense against XSS.

## 2026-04-03 - [Input Length Validation & Global Payload Limits]
**Vulnerability:** Application was susceptible to DoS via excessively large request bodies or computationally expensive regex on extremely long input strings (e.g. 1MB "ally code").
**Learning:** Defense-in-depth requires both application-level validation (length checks before regex) and infrastructure-level limits (express body-parser 'limit'). Modernizing security headers also means moving to `X-XSS-Protection: 0` when a strong CSP is present.
**Prevention:** Always set explicit `limit` on body parsers and perform O(1) length checks on user input before running more complex validation logic.

## 2025-05-15 - [Strict CSP and Inline Style Removal]
**Vulnerability:** Use of `'unsafe-inline'` in `Content-Security-Policy` allowed for potential CSS-based injection or exploitation of style-based vulnerabilities.
**Learning:** Moving all inline styles (including small markers like red asterisks) to external CSS classes is necessary to achieve a strict CSP without `'unsafe-inline'`. This requires careful auditing of all template files (EJS).
**Prevention:** Enforce a strict CSP from the start and use CSS classes for all visual markers and dynamic styling.

## 2025-05-16 - [In-Memory Rate Limiting & Test Isolation]
**Vulnerability:** Lack of rate limiting on search endpoints exposed the application to automated scraping and resource exhaustion (DoS).
**Learning:** Implementing in-memory rate limiting with `node-cache` is effective for small apps, but requires careful test isolation. Standard Jest tests share the same process, so the in-memory cache persists across tests, causing subsequent tests to fail with 429 errors.
**Prevention:** Use `jest.resetModules()` in `beforeEach` to ensure a fresh application instance and cache for every test case.

## 2025-05-17 - [Proxy Trust & Strict Rate Limit Windows]
**Vulnerability:** IP-based rate limiting was ineffective when the app was deployed behind a proxy (all traffic shared the proxy IP). Additionally, a simple increment-based cache allowed users to "slide" their rate limit window by making frequent requests.
**Learning:** `app.set('trust proxy', 1)` is essential for accurate IP detection in Express. Using `node-cache.getTtl()` allows calculating the exact remaining duration of a window, enabling a strict fixed-window strategy that prevents window extension via frequent hits.
**Prevention:** Always configure `trust proxy` in production-ready Express apps. Implement strict windowing by preserving the original TTL during cache updates.

## 2025-05-18 - [DoS Protection Restoration & Security Header Hardening]
**Vulnerability:** A regression removed the `pendingRequests` Map, causing a `ReferenceError` and disabling concurrent request coalescing, which exposed the application to thundering herd DoS attacks.
**Learning:** Core security/optimization logic like request coalescing can be accidentally removed during refactoring if not explicitly guarded or documented. Hardening CSP by removing `'unsafe-inline'` requires moving all inline styles to external classes.
**Prevention:** Use descriptive comments for critical security/performance variables. Ensure security headers like HSTS use `preload` and CSP includes `frame-ancestors` and `upgrade-insecure-requests` for defense-in-depth.
