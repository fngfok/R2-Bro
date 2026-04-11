## 2026-04-01 - [Ally Code Validation & Security Headers]
**Vulnerability:** Lack of input validation on `allyCode` allowed for potential path traversal and redirect manipulation. Absence of security headers left the app vulnerable to MIME-sniffing and clickjacking.
**Learning:** Even simple numeric inputs like SWGOH ally codes can be vectors for injection if not strictly validated against a regex pattern. Re-implementing app logic in tests was a mistake; refactoring `app.js` to export the `app` instance is the proper way to enable robust integration testing.
**Prevention:** Always validate user input at the route level using strict regex. Implement standard security headers as a base layer of defense.

## 2025-05-15 - [Strict CSP and Payload Limits]
**Vulnerability:** Defense in depth against XSS and DoS.
**Learning:** Implementing a strict `Content-Security-Policy` (`default-src 'self'`) in an EJS-based application requires careful verification of all templates to ensure no inline scripts or styles are used, as these would be blocked. Similarly, a very tight payload limit (e.g., 1KB) is excellent for simple search forms but must be communicated to the team to avoid breaking future features that require larger POST bodies.
**Prevention:** Use automated frontend verification (e.g., Playwright) to check for CSP violations in the console after applying strict policies.
