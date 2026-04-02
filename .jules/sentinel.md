## 2026-04-01 - [Ally Code Validation & Security Headers]
**Vulnerability:** Lack of input validation on `allyCode` allowed for potential path traversal and redirect manipulation. Absence of security headers left the app vulnerable to MIME-sniffing and clickjacking.
**Learning:** Even simple numeric inputs like SWGOH ally codes can be vectors for injection if not strictly validated against a regex pattern. Re-implementing app logic in tests was a mistake; refactoring `app.js` to export the `app` instance is the proper way to enable robust integration testing.
**Prevention:** Always validate user input at the route level using strict regex. Implement standard security headers as a base layer of defense.
