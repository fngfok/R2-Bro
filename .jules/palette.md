## 2025-05-15 - Search UX and Accessibility Enhancements
**Learning:** Adding a visible `<label>` is superior to just `aria-label` for accessibility as it provides a clear target for all users and works better with screen readers. Combining input flexibility (allowing spaces/dashes) with a backend sanitizer improves the user experience for copy-pasted content.
**Action:** Always prefer semantic `<label>` elements for forms. Ensure backend validation mirrors frontend flexibility by sanitizing common separators like spaces and dashes.
## 2025-05-14 - Loading states and input tolerance

**Learning:** Users often copy-paste ally codes from the game which might include spaces or dashes. The interface should be tolerant of these formats both on the frontend and backend. Additionally, providing immediate feedback via a "Searching..." state on the submit button prevents duplicate clicks and informs the user that the request is in progress.

**Action:** Always ensure input fields for formatted numbers (like ally codes) are tolerant of common delimiters and provide immediate visual feedback for asynchronous operations. Make sure UXs opened pull requests are up to date from main

# 🎨 Palette's Journal - UX & Accessibility Learnings

This journal documents critical UX and accessibility learnings encountered during the development of R2 Bro.

## 2025-05-14 - Atomic UX Improvements
**Learning:** For a micro-UX agent, it's critical to focus on single, high-impact improvements and stay within line limits (<50 lines). Core layout changes (like switching to Flexbox sticky footers) should be requested separately and can distract from the main goal.
**Action:** Prioritize atomic improvements like loading states and ARIA labels. Avoid global tag styling in favor of targeted class/ID styling if possible, though minimal global states like `:disabled` can be acceptable if no other utility classes exist.
# 🎨 Palette's Journal

## 2025-05-15 - [Immediate Feedback with Loading States]
**Learning:** For asynchronous operations like player searches, users benefit significantly from immediate visual feedback. Disabling the submit button and changing its text to "Searching..." prevents duplicate submissions and confirms the action is being processed.
**Action:** Always implement loading states for form submissions that involve network requests to improve responsiveness and prevent race conditions.

## 2025-05-22 - [Refining CSS for Micro-UX]
**Learning:** Avoid global tag styling (e.g., `button`, `input`) in `style.css` to prevent unintended side effects across the app. Use targeted classes instead.
**Action:** When implementing a micro-UX improvement, define specific CSS classes (e.g., `.search-button`) and apply them only to the relevant elements in the template.

## 2025-05-22 - [Loading State Feedback]
**Learning:** Providing immediate visual feedback (e.g., disabling the button and changing its text to "Searching... 🤖") prevents multiple submissions and improves the perceived speed of the application.
**Action:** Always implement a loading state for primary actions that involve external API calls or long-running processes.

## 2026-04-05 - SWGOH Ally Code UX Pattern
**Learning:** For game-specific identifiers like SWGOH Ally Codes, users frequently use dashes or spaces for readability. The UI and backend should support these formats even if the core logic uses a raw 9-digit number.
**Action:** Use `pattern="[0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]{3}"` on the frontend and `replace(/[- ]/g, '')` on the backend for robust input handling.

## 2026-04-05 - Sticky Footer and Flex Layout
**Learning:** A fixed footer can overlap content on short pages or small screens. Using a Flexbox column layout on the body is a cleaner way to achieve a sticky footer that respects content flow.
**Action:** Set `body { display: flex; flex-direction: column; min-height: 100vh; }` and `main { flex: 1; }`.
