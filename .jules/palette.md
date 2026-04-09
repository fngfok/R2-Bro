## 2025-05-15 - Improving Form Submission UX with BFCache Support
**Learning:** Disabling a submit button on form submission provides great immediate feedback but can break the UX if the user navigates back to the page via the browser's Back button. The browser's Back-Forward Cache (BFCache) might preserve the disabled state of the button.
**Action:** Always pair button-disabling logic with a `pageshow` event listener that checks `event.persisted` to re-enable the button when the user returns to the page.
>>>>>>> REPLACE
