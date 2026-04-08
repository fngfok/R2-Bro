## 2025-05-15 - Search UX and Accessibility Enhancements
**Learning:** Adding a visible `<label>` is superior to just `aria-label` for accessibility as it provides a clear target for all users and works better with screen readers. Combining input flexibility (allowing spaces/dashes) with a backend sanitizer improves the user experience for copy-pasted content.
**Action:** Always prefer semantic `<label>` elements for forms. Ensure backend validation mirrors frontend flexibility by sanitizing common separators like spaces and dashes.
