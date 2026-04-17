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

## 2025-05-23 - [Consistent Focus Indicators with :focus-visible]
**Learning:** Using :focus-visible instead of :focus allows for clear keyboard navigation indicators (using outline-offset for better visibility) without affecting the experience for mouse users, maintaining both accessibility and visual polish.
**Action:** Apply `outline: 3px solid #3498db; outline-offset: 2px;` via `:focus-visible` to all interactive elements for a consistent, accessible focus pattern.
