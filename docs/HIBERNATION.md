# Project Hibernation Plan

Updated: 2026-07-17 America/Denver

## Pause Point

The project is paused after Stage 3. The repository contains a runnable, accessible vertical slice:

- Museum hub and fictional Floodplain Memory portal
- Young Stegosaurus transformation and Fern Edge habitat shell
- Deterministic movement, forage, ground-sense, evidence, return, and notebook flow
- Keyboard, pointer, touch, simplified controls, pause, reduced motion, focus management, and live announcements
- Placeholder visuals only; no unapproved third-party assets or real museum branding
- Stage 4 OpenAI interpretation/composition integration has not started

## Verified Before Pause

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run content:validate`
- `npm run build`
- Local desktop and mobile Playwright flow checks

## Known Blockers

- `OPENAI_API_KEY` is not configured locally, so live model integration remains untested.
- A Vercel project and preview URL have not been connected.
- `npm audit --omit=dev` reports two moderate findings through Next.js's transitive PostCSS dependency. Do not use the suggested major downgrade; reassess on the next compatible Next.js release.
- Build Week submission materials are not complete: final narrative, public demo video, and `/feedback` session ID remain outstanding.

## Resume Sequence

1. Read `AGENTS.md`, `PLAN.md`, `STATUS.md`, `DECISIONS.md`, and this file.
2. Confirm the working tree and remote before making changes.
3. Create `.env.local` from `.env.example` only if live AI work begins. Keep the real key local and server-only.
4. Re-read the OpenAI documentation skill and verify the current Responses API/model configuration.
5. Implement Stage 4 as a server-side interpretation/composition layer with validated outputs, narrow tools, deterministic fallbacks, and tests for missing keys, provider failures, prompt injection, and hallucinated targets.
6. Run every required quality check, then perform desktop and mobile browser checks.
7. Connect Vercel and record the preview URL in `STATUS.md` and `docs/DEPLOYMENT.md`.
8. Complete the submission narrative, record the demo video, capture the required `/feedback` session ID, and perform a final public-repository secret scan.

## Security Rules

- Never commit `.env.local`, API keys, access tokens, cookies, or private credentials.
- Use `.env.example` for variable names and empty or clearly fake placeholders only.
- Keep `OPENAI_API_KEY` in server-only environment variables; never use a `NEXT_PUBLIC_` name for it.
- Before every push, inspect `git diff --cached` and confirm `git status --ignored --short` shows `.env.local` as ignored if it exists.
- If a secret is exposed, revoke it immediately and create a replacement before continuing.

## Hibernation Exit Criteria

The pause can end when a new stage is explicitly chosen, the required account/configuration blockers are available, and the owner confirms the next implementation goal.
