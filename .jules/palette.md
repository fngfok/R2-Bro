## 2025-05-14 - Loading states and input tolerance

**Learning:** Users often copy-paste ally codes from the game which might include spaces or dashes. The interface should be tolerant of these formats both on the frontend and backend. Additionally, providing immediate feedback via a "Searching..." state on the submit button prevents duplicate clicks and informs the user that the request is in progress.

**Action:** Always ensure input fields for formatted numbers (like ally codes) are tolerant of common delimiters and provide immediate visual feedback for asynchronous operations.
