# Admin Security Migration Plan for Static Firebase Hosting

## Goal

Migrate the admin security model away from any server-capable Next.js assumptions and standardize on a static-safe architecture where:

- the `/admin` route guard exists only for UX
- Firebase Authentication identifies the user
- Firebase custom claims determine admin identity
- Firestore Security Rules and Realtime Database Rules enforce real authorization
- all sensitive protection lives in Firebase, not in Next.js route handling

This plan assumes the app remains deployed as a static export on Firebase Hosting.

---

## Target Architecture

### What stays client-side

- Next.js static pages
- admin login UI
- admin route guard for loading, redirect, and friendly access-denied UX
- Firebase client SDK data fetching for admin pages

### What becomes the real security boundary

- Firebase Auth token
- Firebase custom claims such as `isAdmin: true`
- Firestore rules for admin-only reads and destructive actions
- RTDB rules for admin-only global reads and admin-only privileged actions

### What is explicitly not part of this architecture

- Next.js API routes
- Next.js middleware
- server-side route protection
- server sessions or cookies
- private request-time backend logic in the deployed app

---

## Security Principles

1. Never trust route access alone.
2. Never trust `user != null` as admin authorization.
3. Never treat anonymous users as eligible for admin access.
4. Never expose Admin SDK credentials to the browser.
5. Always enforce admin data access with Firebase rules.
6. Always use custom claims as the runtime source of truth for admin identity.
7. Keep the frontend route guard only as UX, not as the real enforcement layer.

---

## Current Migration Objective

Move from this mental model:

- "Admin is protected because the route/UI checks the current user."

To this model:

- "Admin is secure because Firebase blocks non-admin tokens from reading admin data or performing admin actions."

---

## Scope

### In scope

- admin sign-in flow
- admin identity verification
- admin route guard UX
- Firestore admin reads and admin actions
- RTDB admin reads and admin actions
- admin claim provisioning workflow
- admin env variable cleanup for local/CI scripts
- testing and rollout checklist

### Out of scope

- converting the app to SSR
- moving to Firebase App Hosting
- adding Cloud Functions-based admin APIs
- hiding `/admin` at the HTTP routing layer

---

## Migration Phases

## Phase 1: Freeze the Security Model

### Outcome

The team agrees that Firebase, not Next.js routing, is the enforcement layer.

### Todos

- [ ] Document the architecture decision that `/admin` cannot be server-protected in static hosting.
- [ ] Document that admin security means protecting data and actions, not preventing the HTML route from loading.
- [ ] Define the source of truth for admin identity as Firebase custom claims.
- [ ] Remove any requirement or future task that assumes middleware, server sessions, or API routes are necessary for admin security in this deployment model.

### Acceptance criteria

- Everyone working on admin features uses the same static-hosting security model.
- No future plan item depends on a live Next.js server unless the hosting strategy changes.

---

## Phase 2: Normalize Admin Identity

### Outcome

Admin identity is based only on Firebase custom claims, not email allowlists or client-only assumptions.

### Todos

- [ ] Define the exact custom claims schema:
  - `isAdmin: true`
  - optional `adminRole: 'admin'`
- [ ] Remove any leftover runtime dependency on email allowlists for authorization.
- [ ] Remove any leftover runtime dependency on Firestore `admins/{uid}` documents if they are only being used to decide access.
- [ ] Ensure anonymous users are always rejected from admin access checks.
- [ ] Force token refresh when checking admin access after login so claim changes take effect predictably.
- [ ] Standardize admin-denied UI copy so it explains missing claims, not missing client state.

### Acceptance criteria

- Admin authorization succeeds only when the Firebase ID token contains the admin claim.
- Anonymous and ordinary authenticated users fail admin authorization even if they can reach the route.

---

## Phase 3: Keep Frontend Route Guard for UX Only

### Outcome

The `/admin` route guard improves user experience without being treated as the security boundary.

### Todos

- [ ] Keep a client-side guard that handles:
  - loading state
  - sign-in prompt
  - anonymous-user rejection
  - admin-denied message
- [ ] Ensure the guard does not claim to be secure by itself.
- [ ] Ensure admin UI does not render privileged content until claim verification completes.
- [ ] Ensure sign-out is available from the denied state and admin profile state.
- [ ] Ensure admin layouts and nested pages do not duplicate wrappers or accidentally render content before the guard resolves.

### Acceptance criteria

- Non-admin users can visit `/admin`, but they do not see privileged data.
- The UI clearly distinguishes between unauthenticated, anonymous, and non-admin states.

---

## Phase 4: Enforce Admin Access in Firestore Rules

### Outcome

Firestore becomes the actual enforcement layer for admin reads and destructive admin operations.

### Todos

- [ ] Audit every Firestore path used by admin features:
  - room listing
  - message listing
  - stats queries
  - delete actions
- [ ] Restrict collection listing used by admin dashboards to `request.auth.token.isAdmin == true`.
- [ ] Restrict message history reads used only by admin tools to `request.auth.token.isAdmin == true`.
- [ ] Preserve non-admin chat flows only where genuinely required for the public product.
- [ ] Ensure create/update rules for public chat remain scoped to authenticated room participants, not broad admin assumptions.
- [ ] Validate that delete/update behavior is explicit and not accidentally inherited from broad write rules.
- [ ] Re-run rule review for privilege escalation, overly broad list access, and anonymous-user exposure.

### Acceptance criteria

- Non-admin users cannot list rooms for admin dashboards.
- Non-admin users cannot read Firestore message archives intended for admin tooling.
- Admin reads and admin deletes succeed only with the proper claim.

---

## Phase 5: Enforce Admin Access in RTDB Rules

### Outcome

RTDB protects global admin visibility while preserving live room functionality for normal chat users.

### Todos

- [ ] Audit RTDB usage by path:
  - `rooms`
  - `rooms/{roomId}/messages`
  - `rooms/{roomId}/presence`
  - `rooms/{roomId}/typing`
- [ ] Block broad top-level `rooms` reads for non-admin users.
- [ ] Preserve scoped per-room reads needed for live chat UX.
- [ ] Preserve per-user writes only where the current user owns the presence/typing path.
- [ ] Ensure admin-wide user aggregation pages only work because admin claims unlock the broader tree read.
- [ ] Add validation where useful to reduce malformed writes.
- [ ] Reconfirm that non-admin users cannot use RTDB to reconstruct the admin dashboard.

### Acceptance criteria

- Normal chat still works.
- Global RTDB introspection used by admin pages is blocked for non-admin users.
- Admin claim holders can access the broader RTDB views needed by admin tooling.

---

## Phase 6: Migrate All Admin Screens to the Firebase-Enforced Model

### Outcome

Every admin page relies on Firebase-enforced access instead of trust in the route or local state.

### Todos

- [ ] Audit all admin pages:
  - dashboard
  - messages
  - users
  - settings
  - profile
- [ ] Verify which data source each page uses.
- [ ] Remove any code path that assumes signed-in equals admin.
- [ ] Ensure admin data loaders fail safely when permissions are denied.
- [ ] Add user-friendly error states for permission-denied responses.
- [ ] Ensure settings or moderation actions never bypass claims-based authorization.
- [ ] Ensure admin pages do not fetch global data before the guard verifies the claim.

### Acceptance criteria

- Every admin page behaves correctly for admin and non-admin tokens.
- Permission-denied errors are handled gracefully and do not leak sensitive UI state.

---

## Phase 7: Standardize Admin Claim Provisioning

### Outcome

There is a safe, repeatable way to grant and revoke admin access without a server runtime in the deployed app.

### Todos

- [ ] Keep admin claim provisioning outside the hosted frontend.
- [ ] Standardize one provisioning mechanism:
  - local script
  - CI job
  - secure operator-only process
- [ ] Define server-only env variables for the provisioning script.
- [ ] Ensure Admin SDK credentials are never prefixed with `NEXT_PUBLIC_`.
- [ ] Ensure the provisioning workflow supports both `grant` and `revoke`.
- [ ] Document the operational rule that users must refresh their ID token after claim changes.
- [ ] Restrict access to service account credentials to trusted operators only.

### Acceptance criteria

- Admin claims can be granted and revoked safely.
- No admin credential is exposed to the browser bundle.

---

## Phase 8: Clean Up Environment Variables

### Outcome

Environment variables clearly separate browser-safe Firebase config from server-only admin tooling config.

### Todos

- [ ] Keep Firebase client config under `NEXT_PUBLIC_FIREBASE_*`.
- [ ] Keep Admin SDK script config under server-only `FIREBASE_*`.
- [ ] Remove intermediary alias variables that duplicate the same values.
- [ ] Ensure local scripts load env files the same way Next.js expects.
- [ ] Verify `.env.example` reflects the final intended setup without misleading mappings.
- [ ] Review documentation so it no longer suggests admin env values should use `NEXT_PUBLIC_*`.

### Acceptance criteria

- Browser-safe envs and server-only envs are clearly separated.
- No admin tooling depends on exposed `NEXT_PUBLIC_*` names for its own secrets.

---

## Phase 9: Testing and Validation

### Outcome

The static Firebase security model is proven with explicit role-based checks.

### Test matrix

- anonymous user
- authenticated non-admin user
- authenticated admin user
- stale token after claim grant/revoke
- unauthenticated browser session

### Todos

- [ ] Verify anonymous users are shown the admin login flow and cannot read admin data.
- [ ] Verify authenticated non-admin users get access denied and cannot read admin data.
- [ ] Verify authenticated admin users can load dashboard, messages, users, settings, and profile.
- [ ] Verify Firestore rules reject non-admin admin reads.
- [ ] Verify RTDB rules reject non-admin global admin reads.
- [ ] Verify destructive admin actions fail for non-admin users.
- [ ] Verify claim revoke removes access after token refresh.
- [ ] Verify claim grant enables access after token refresh.
- [ ] Verify lint/build passes after the migration.
- [ ] If using emulators, validate rules and auth behavior locally before production deploy.

### Acceptance criteria

- Every privileged admin read and action is blocked for non-admin users by Firebase itself.
- The frontend behaves correctly in all auth states.

---

## Phase 10: Rollout and Operations

### Outcome

The migration is deployed safely and remains maintainable.

### Todos

- [ ] Deploy updated Firestore rules.
- [ ] Deploy updated RTDB rules.
- [ ] Roll out UI changes for admin auth and denied states.
- [ ] Grant claims to the intended admin users.
- [ ] Revoke any legacy or temporary admin access patterns.
- [ ] Run a post-deploy verification against production.
- [ ] Keep an operator checklist for future admin onboarding/offboarding.

### Acceptance criteria

- Production rules and admin claims match the new architecture.
- Legacy authorization paths are no longer relied upon.

---

## Best Practices Checklist

- [ ] Treat Firebase rules as the real enforcement point.
- [ ] Treat the route guard as UX only.
- [ ] Use claims, not just email presence, for admin authorization.
- [ ] Reject anonymous users explicitly.
- [ ] Keep all Admin SDK credentials server-only.
- [ ] Use least-privilege rules for both Firestore and RTDB.
- [ ] Handle permission-denied errors intentionally in the UI.
- [ ] Keep claim grant/revoke workflows operationally documented.
- [ ] Re-test security whenever admin pages or Firebase rules change.

---

## Risks and Mitigations

### Risk: False sense of security from the route guard

Mitigation:

- Treat the guard as presentation logic only.
- Verify all sensitive reads/actions are blocked by Firebase rules.

### Risk: Non-admin users still visiting `/admin`

Mitigation:

- Accept this as a static-hosting limitation.
- Ensure no privileged data loads without admin claims.

### Risk: Stale ID tokens after claim changes

Mitigation:

- Force token refresh in admin access checks after login.
- Document re-login or refresh steps for operators.

### Risk: Overly broad rules breaking chat UX

Mitigation:

- Audit public chat read/write paths separately from admin-wide views.
- Test public room messaging, presence, and typing after each rule change.

### Risk: Admin SDK credentials leaking

Mitigation:

- Keep Admin SDK values in server-only env vars.
- Never prefix them with `NEXT_PUBLIC_`.
- Never reference them from client code.

---

## Definition of Done

This migration is complete only when all of the following are true:

- [ ] Admin identity is based on Firebase custom claims.
- [ ] `/admin` uses a frontend route guard for UX only.
- [ ] Firestore rules enforce admin-only admin reads/actions.
- [ ] RTDB rules enforce admin-only global admin visibility/actions.
- [ ] Anonymous users cannot satisfy admin access checks.
- [ ] Non-admin authenticated users cannot load admin data.
- [ ] Admin claim provisioning is documented and operational.
- [ ] Browser-safe and server-only env vars are clearly separated.
- [ ] The static app builds and runs without any server-capable Next.js requirement.

---

## Recommended Implementation Order

1. Freeze the architecture decision.
2. Standardize custom claims as the only admin identity source.
3. Tighten Firestore and RTDB rules.
4. Update frontend admin guard and error states.
5. Standardize claim provisioning and envs.
6. Run emulator and production-role testing.
7. Deploy rules and complete admin onboarding/offboarding workflow.
