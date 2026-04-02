## 2025-05-22 - [Refining CSS for Micro-UX]
**Learning:** Avoid global tag styling (e.g., `button`, `input`) in `style.css` to prevent unintended side effects across the app. Use targeted classes instead.
**Action:** When implementing a micro-UX improvement, define specific CSS classes (e.g., `.search-button`) and apply them only to the relevant elements in the template.

## 2025-05-22 - [Loading State Feedback]
**Learning:** Providing immediate visual feedback (e.g., disabling the button and changing its text to "Searching... 🤖") prevents multiple submissions and improves the perceived speed of the application.
**Action:** Always implement a loading state for primary actions that involve external API calls or long-running processes.
