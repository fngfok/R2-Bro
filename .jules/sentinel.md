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
