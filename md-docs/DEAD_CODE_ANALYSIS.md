# Dead Code Analysis

> **Date:** 2026-06-17
> **Scope:** `./src/` (excluding `./src/components/ui/`)
> **Files scanned:** 49

A conservative audit of the source tree to identify files, modules, and exports that are stale, outdated, unused, or safe to remove. Each candidate is backed by evidence from a full reference trace across the codebase.

---

## Summary

| Category | Count |
|----------|-------|
| Safe to remove | 5 |
| Needs manual review | 4 |
| Total candidates | 9 |

The codebase is generally clean and well-connected. The findings below are limited to items with clear evidence of being unused or obsolete. No active code was flagged.

---

## Safe to remove

These items have zero references anywhere in `./src/` and can be deleted without risk.

### 1. `src/components/PresenceIndicator.tsx`

| Field | Value |
|-------|-------|
| **Confidence** | High |
| **Reason** | Not imported anywhere. `PresenceList` renders its own inline presence dots and does not use this component. |
| **References found** | None (only mentioned in `plans/firebase-implementation-plan.md`) |
| **Action** | Delete the file |

### 2. `src/components/TypingIndicator.tsx`

| Field | Value |
|-------|-------|
| **Confidence** | High |
| **Reason** | Not imported anywhere. `MessageList` renders its own inline typing indicator with bouncing dots and does not use this component. |
| **References found** | None (only mentioned in `plans/firebase-implementation-plan.md`) |
| **Action** | Delete the file |

### 3. `FEATURES` constant in `src/constants/index.ts`

| Field | Value |
|-------|-------|
| **Confidence** | High |
| **Reason** | Exported but never imported. The home page (`src/app/page.tsx`) defines its feature cards inline with hardcoded icons and colors rather than consuming this constant. |
| **References found** | None outside the declaration |
| **Action** | Remove the `FEATURES` export |

### 4. `MOCK_MESSAGES` constant in `src/constants/index.ts`

| Field | Value |
|-------|-------|
| **Confidence** | High |
| **Reason** | Exported but never imported anywhere. Leftover mock data from early development, replaced by real Firebase data. |
| **References found** | None outside the declaration |
| **Action** | Remove the export |

### 5. `MOCK_USERS` constant in `src/constants/index.ts`

| Field | Value |
|-------|-------|
| **Confidence** | High |
| **Reason** | Exported but never imported anywhere. Same as `MOCK_MESSAGES` — leftover scaffolding data. |
| **References found** | None outside the declaration |
| **Action** | Remove the export |

---

## Needs manual review

These items appear unused but carry some risk. Review the noted caveats before removing.

### 1. `signUpWithEmail` and `getCurrentUser` in `src/lib/auth.ts`

| Field | Value |
|-------|-------|
| **Confidence** | Medium |
| **Reason** | These two exported functions are defined but never called anywhere in the codebase. Only `signInWithEmail`, `signInWithGoogle`, and `getAuthErrorMessage` from `auth.ts` are used (by `AdminAuth.tsx`). |
| **References found** | None outside the declaration |
| **Caveat** | `signUpWithEmail` may be intended for a future admin signup flow. `getCurrentUser` is redundant since the `useAuth` hook manages current user state via `onAuthStateChanged`. Review whether admin account creation is handled elsewhere before removing. |

### 2. `DYNAMIC_PARAMS` constant in `src/constants/index.ts`

| Field | Value |
|-------|-------|
| **Confidence** | Low |
| **Reason** | Exported but never imported. The dynamic route page (`src/app/room/[id]/page.tsx`) declares its own local `export const dynamicParams = false` directly, so this constant appears to be a duplicate that was never wired up. |
| **References found** | None outside the declaration |
| **Caveat** | Verify this was not intended to be imported by the dynamic route page. |

### 3. `src/app/room/[id]/page.tsx` (legacy dynamic route)

| Field | Value |
|-------|-------|
| **Confidence** | Low |
| **Reason** | This is a statically-generated route (`dynamicParams = false`) that only pre-renders the 5 `DUMMY_ROOMS` IDs. The primary room entry point is `/room?roomid=<id>` (query param route). The legacy route may still receive traffic from old shared links or SEO. |
| **References found** | It is a Next.js route — automatically active at `/room/<id>` |
| **Caveat** | Do not remove unless you have confirmed no external links point to `/room/<id>` URLs. It is harmless to keep. |

---

## Methodology

- **Full reference tracing:** Every file and exported symbol under `./src/` was searched for imports and usages across the entire source tree.
- **Exclusions:** The `./src/components/ui/` directory was excluded as it contains Shadcn UI primitives that may be used dynamically or added proactively.
- **False positive prevention:** Route files (`page.tsx`, `layout.tsx`) were treated as active code since Next.js discovers them by convention, not by import. Re-exports (e.g., `isFirebaseConfigured` from `firebase.ts`) were traced to confirm they are not dead.
- **Planning docs:** References found only in `plans/` markdown files were not counted as active usage, since those are documentation, not executable code.

---

## Recommended cleanup steps

1. **Delete the two unused components:**
   ```bash
   rm src/components/PresenceIndicator.tsx
   rm src/components/TypingIndicator.tsx
   ```

2. **Remove unused constants** from `src/constants/index.ts`:
   - Delete the `FEATURES` array
   - Delete the `MOCK_MESSAGES` array
   - Delete the `MOCK_USERS` array

3. **Review and optionally remove** the medium/low confidence items:
   - `signUpWithEmail` and `getCurrentUser` in `src/lib/auth.ts`
   - `DYNAMIC_PARAMS` in `src/constants/index.ts`
   - `src/app/room/[id]/page.tsx` (only after confirming no external link traffic)

4. **Verify** after cleanup:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
