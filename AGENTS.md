# AI Night at the Museum - Repository Instructions

## Mission

Build a reliable, accessible, original museum-hub and exhibit-portal game. The visitor becomes a young Stegosaurus, completes evidence-bearing habitat challenges, returns to the museum, and reconstructs a fictional prehistoric event. AI expands language and perspective; deterministic code owns all game truth.

## Read First

1. `PLAN.md`
2. `STATUS.md`
3. `DECISIONS.md`
4. Relevant records in `docs/adr/` and the nearest nested `AGENTS.md`
5. `AI_Night_at_the_Museum_Exhibit_Portal_Codex_Package_v2/docs/EXECUTION_PLAN.md`

## Non-Negotiable Invariants

- The language model never mutates game state directly.
- A game canvas never grants durable evidence directly.
- Visitor form exists only in museum mode; Stegosaurus form exists only in portal mode.
- Portal entry, exit, and fragment rewards are explicit, idempotent, and testable.
- Every mini-game maps to an evidence concept.
- The central event is fictional and must not be presented as a real specimen history.
- Required gameplay works without AI composition, voice, audio, or full-motion effects.
- Validate inputs, content, tool calls, bridge events, and save-state payloads.
- Do not commit secrets, unapproved third-party assets, or real museum branding.

## Work Process

- Work against the active goal in `STATUS.md`.
- Keep diffs focused and add tests with behavior changes.
- Update `STATUS.md` and relevant documentation before declaring a stage complete.
- Do not begin Stage 1 until the human owner approves the Stage 0 scope decision.

## Required Checks Once the Application Exists

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run content:validate`
- `npm run build`

## Stop Conditions

Stop and report when a change would alter frozen story truth or architecture, a source/license/scientific claim is unclear, a P0/P1 issue cannot be resolved in the active goal, or a required human decision, account, or secret is missing.
