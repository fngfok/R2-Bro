## 2026-04-05 - SWGOH Ally Code UX Pattern
**Learning:** For game-specific identifiers like SWGOH Ally Codes, users frequently use dashes or spaces for readability. The UI and backend should support these formats even if the core logic uses a raw 9-digit number.
**Action:** Use `pattern="[0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]{3}"` on the frontend and `replace(/[- ]/g, '')` on the backend for robust input handling.

## 2026-04-05 - Sticky Footer and Flex Layout
**Learning:** A fixed footer can overlap content on short pages or small screens. Using a Flexbox column layout on the body is a cleaner way to achieve a sticky footer that respects content flow.
**Action:** Set `body { display: flex; flex-direction: column; min-height: 100vh; }` and `main { flex: 1; }`.
