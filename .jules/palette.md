## 2025-05-14 - BFCache and Form Loading States
**Learning:** When implementing a loading state that disables a submit button on the frontend, navigating back to the page via the browser's back button (BFCache) can leave the button in a disabled state if not handled. Using the `pageshow` event with `event.persisted` is necessary to reset the UI.
**Action:** Always include a `pageshow` listener when adding client-side loading states to forms to ensure a smooth "back" navigation experience.
