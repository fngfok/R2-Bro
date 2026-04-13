## 2025-05-14 - Loading State Resilience
**Learning:** When implementing loading states that disable buttons on form submission, the button can remain disabled if the user navigates back to the page via the browser's Back-Forward Cache (BFCache).
**Action:** Always listen for the `pageshow` event and check `event.persisted` to re-enable interactive elements when the page is restored from cache.

## 2025-05-14 - Semantic Labels vs ARIA Labels
**Learning:** Semantic `<label>` elements are superior to `aria-label` for form inputs because they provide a larger hit target (clicking the label focuses the input) and are more universally supported by assistive technologies.
**Action:** Prioritize `<label for="id">` over `aria-label` whenever the design allows for visible text labels.

## 2025-05-14 - Focus Visibility for Accessibility
**Learning:** Default browser focus outlines are often subtle or removed by reset CSS, making keyboard navigation difficult.
**Action:** Implement a high-contrast `:focus-visible` style (e.g., `outline: 3px solid #3498db; outline-offset: 2px;`) to provide clear visual feedback for keyboard users without affecting mouse users.
