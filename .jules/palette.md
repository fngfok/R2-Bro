## 2026-04-11 - Handling BFCache for Loading States
**Learning:** When implementing loading states that disable buttons on form submission, the button may remain disabled if the user navigates back via the browser's Back/Forward Cache (BFCache).
**Action:** Use the `pageshow` event with `event.persisted` to detect BFCache restoration and re-enable interactive elements like submit buttons.
