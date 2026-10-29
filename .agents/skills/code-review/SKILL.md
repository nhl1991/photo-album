---
name: code-review
description: Use when reviewing a PR or auditing code in this repository. Review the Photo Album Next.js project backed by Firebase Auth, Firestore, and Storage, with Google location APIs and EXIF-based photo uploads. Focus on correctness, authentication, authorization, data consistency, performance, and regressions.
---

# Photo Album Code Review

For PR reviews, inspect changed code and the relevant surrounding call chain; report defects introduced by the change. For project audits, inspect active application flows and report existing actionable defects within the requested scope. Trace actual callers before treating legacy helpers or installed dependencies as active behavior.

## 1. Authentication and Session Handling
- Use `requireUser()` for protected routes and `getUserOptional()` for optional identity on public routes (`src/lib/auth/`). Flag new route code that bypasses these helpers by reading `cookies().get("session")` directly. Direct session cookie access is expected only in `src/lib/auth/*` (centralized access), `src/app/api/auth/login` and `src/app/api/auth/logout` (issuing and clearing), and `src/middleware.tsx` (presence check before redirect).
- Verify Firebase session cookies are issued, verified, and invalidated correctly (login, logout, password change, and — once an account-deletion feature exists — account deletion should all affect session validity).
- If password change is done via the client Firebase SDK rather than a server API route, check that the server session cookie is also refreshed/invalidated so it doesn't stay valid on the old credentials.
- Check httpOnly/secure/sameSite cookie settings and server session verification on protected operations across `src/app/api/auth/**`, `src/app/api/posts/**`, and `src/app/api/geocode/**`. Distinguish intentionally public reads from authenticated writes; do not assume every posts route requires login.
- Never trust a client-supplied `uid`; derive the authenticated user from the verified session on the server.
- Check for GET routes with unexpected write side effects (e.g. `/api/auth/me` should not mutate state as a side effect of being called).
- Check guards (`AccountContainer`, middleware) distinguish pending authentication from guests and do not expose protected content before redirect. Cookie presence or a client-side redirect alone must not authorize protected server data or operations.
- Check new protected pages are covered by middleware's `protectedPaths` and any matcher configuration. Exact `includes(pathname)` checks do not cover nested paths; verify intended protection for descendants without matching unrelated path prefixes.
- Check that rate limiting (`src/lib/ratelimit.ts`) is applied consistently across sensitive/abuse-prone routes (login, post/comment creation, geocoding, etc.), not just the ones that already have it.
- Check TanStack Query keys and cache cleanup isolate user-specific data, including favorites and ownership flags, across login, logout, and account switching. Verify mutations refresh affected detail and list queries.

## 2. Firestore / Storage Security and Ownership
- Check that Firestore/Storage Security Rules (if available) cover affected client read/write paths. Admin SDK access bypasses these rules and needs server authorization. If deployed rules are unavailable, report the verification limitation rather than assuming a vulnerability.
- Verify ownership checks before update/delete (a user can only modify their own post/comment/favorite).
- Check that deleting a post also cleans up its subcollections (comments, likes) and reverse indexes (`users/*/likedPosts`), not just the parent document.
- Client SDK writes, including direct Storage uploads, are an intentional part of this project. Check that Security Rules and server validation together enforce ownership, allowed paths, and data constraints; flag a concrete bypass rather than direct SDK usage itself.

## 3. API Routes: Error Responses and Input Validation
- Use `handleApiError` for API error responses with the `{ error: code }` contract. Preserve warning logs for 4xx and error logs with the underlying cause for 5xx; do not expose causes or credentials in responses.
- Treat error codes consumed by clients (for example, `USER_DISABLED`) as API contracts. Flag changes that break client branching unless the affected callers are updated together.
- Check request bodies are validated (schema/length limits) server-side, not only on the client.
- Check `id`/query params are validated before being used in Firestore queries (no unvalidated values causing crashes or wrong-type queries).
- Check pagination cursors/sort keys are unique enough to avoid duplicate or skipped items across pages.
- Verify cursor serialization preserves the ordered field's type (especially Firestore Timestamp versus numeric milliseconds), and that the cursor comes from the collection being paginated. Favorites must use the likedPosts ordering, not the fetched post's creation time. Handle empty results and missing referenced posts.
- Check malformed JSON, invalid values, and missing resources produce appropriate error responses instead of unhandled exceptions or successful responses with missing data. Verify parent posts exist before creating comments or likes.
- Check TypeScript types match stored documents and API payloads; assertions must not conceal nullable fields or Timestamp/number mismatches at runtime boundaries.
- Check type safety is not bypassed with `as`, non-null `!`, or `any` where a real check is needed. Verify result types meant as discriminated unions actually narrow (for example, a literal `ok: true`/`ok: false` field rather than an inferred `ok: boolean`), so callers do not need extra workaround conditions.

## 4. Data Consistency (Views, Likes, Comments)
- Check view/like count updates are atomic (transactions or atomic increments), not read-then-write races.
- Check duplicate-prevention logic (e.g. view counts) isn't solely client-side (`localStorage`) when it should be enforced server-side.
- Check comment/like/favorite counts stay consistent with the underlying subcollection documents after create/delete.
- Check partial failures and retries across Firestore and Storage: upload followed by post creation, image deletion, and reverse-index cleanup must not silently leave inconsistent data. Assess duplicate submissions and concurrent create/delete operations in the affected flow.

## 5. External APIs and Secrets (Geocoding, Firebase Admin)
- Keep server Geocoding keys and Firebase Admin credentials out of public env vars, client bundles, responses, and logs. Browser Maps keys are intentionally public; assess API/referrer restrictions when configuration is available and distinguish them from server credentials.
- Check `next.config` `images.remotePatterns` is scoped to the actual storage bucket(s) in use, not wildcarded broader than necessary.
- Check Firebase Admin credentials are only used in server-only modules (`server-only` import present where expected).
- Distinguish `import "server-only"` from `"use server"`: the latter declares Server Actions and can make exported async helpers remotely invocable when exposed through action references. Flag its use on internal helpers (existing cases in `src/lib/auth/getSessionValue.ts` and `src/lib/verifySession.ts` are tracked in #25); inspect action reachability, authorization, inputs, and returned session data rather than assuming every export is a reachable endpoint.

## 6. Uploads and Images
- Check file selection/upload code handles the empty/cancelled-selection case (no indexing into an empty file list).
- Check file size/type constraints are enforced by Storage Rules and/or trusted server checks, not only by the client input. For direct uploads, verify the server checks the expected user's object and relevant metadata before creating a post.
- Check EXIF parsing failures and absent GPS metadata fall back to manual location selection without crashing. The active parser is currently `ExifReader` in `src/utils/exif-utils.ts`; confirm actual imports rather than assuming the installed `exifr` package is used.

## 7. Client Flows and Lifecycle
- Check fetch callers handle non-2xx responses before treating JSON as successful query data, and expose usable error/retry states.
- Trace pagination through the UI: a next cursor or useInfiniteQuery alone does not make later pages reachable; verify the load-more control or observer actually invokes fetchNextPage.
- Check mutation controls prevent unintended duplicate requests and recover from failures. Check forms prevent default browser submission where needed.
- Check auth/Firestore subscriptions are unsubscribed and object URLs or in-flight requests are cleaned up when the affected component or user changes; late responses must not overwrite newer state.

## 8. Performance
- Check user-facing Firestore list queries have an appropriate `.limit()` and pagination. Comparing results with `DOCS_SIZE` does not bound reads (the existing case in `src/app/api/auth/posts/me/route.ts` is tracked in #30); check similar flows. For intentionally exhaustive cleanup, assess batching and workload bounds instead of silently truncating required work.
- Check per-document reads inside loops for N+1 query growth, prefer appropriate bounded bulk reads, and guard empty reference arrays before `getAll()`. Assess read volume and latency as the collection grows.
- Check `next/image` `sizes` reflects rendered widths at each breakpoint to avoid downloading unnecessarily large images.
- Check new `"use client"` boundaries do not pull unnecessary dependencies or otherwise server-renderable subtrees into the client bundle; report concrete bundle or rendering impact rather than the directive alone.

## Review Rules
- Write review findings and comments in Korean. Preserve code, paths, package names, API identifiers, and the severity labels below in their original form.
- Before reporting, check open GitHub issues (`gh issue list --state open`), and read an issue's body when its title alone does not show whether it covers the finding. If GitHub is unavailable (authentication or network failure), state that duplicates could not be checked and continue the review.
  - PR reviews: report only defects introduced by the change or changes that make a tracked issue worse. Mention a related tracked issue for context instead of reporting it as a finding.
  - Project audits: report existing defects, including tracked ones. For each, give the existing issue number and whether the defect still reproduces in the current code.
- Issue numbers cited in this skill are hints that were accurate when written. Re-check the current code and issue state before relying on them.
- Report only actionable findings within the review scope. Do not treat explicitly unfinished features as regressions unless the change exposes them as working behavior.
- Prioritize correctness, security, data consistency, and potential performance regressions over style.
- Include severity, a minimal relevant file/line location, triggering conditions, concrete impact, and a suggested fix. Separate confirmed defects from verification limitations.
- Use repository severity labels: **Critical** — immediate action required; **High** — direct security impact or structural defects; **Medium** — functional failures, consistency problems, or cost impact; **Low** — hygiene or edge cases. Select severity from demonstrated impact and triggering conditions; Low findings must still be actionable.
- Avoid speculative warnings and stylistic preferences handled by lint/format.
- Run available checks appropriate to the reviewed behavior when useful; state what was checked and what could not be verified. Do not claim runtime validation from static inspection alone.
- Use `npx tsc --noEmit -p .` and `npx eslint src`. Some failures exist independently of most changes: stale errors from `.next/types`, and `next build`/`tsc` failing on `@/scripts/migrate-post-author`, a gitignored module imported by `src/app/api/migrate/route.ts` (tracked in #38). Exclude a failure from findings only after confirming its location and message match the same failure on the base branch or in the tracked issue; a similar error that is new or worse in the change is a finding. Always list check failures in the results, including excluded ones.
- Do not modify application files during review. Changes to this skill require an explicit skill-editing request.
