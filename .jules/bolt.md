## 2025-05-22 - Managing Lockfiles in Limited Environments
**Learning:** Running `pnpm install` in this environment generates a `pnpm-lock.yaml` file with >3700 lines. Including this in a PR violates line-count constraints and pollutes the review.
**Action:** Always delete `pnpm-lock.yaml` before submitting a PR unless explicit dependency changes are required and the lockfile is specifically requested.
