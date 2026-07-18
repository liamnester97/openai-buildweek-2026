# Active Implementation Plan

## Stage

Stage 3 - Museum Hub, Portal Canvas Shell, and Accessibility Foundation

## Goal

Make the deterministic vertical slice playable with placeholder art through React plus a client-only habitat canvas.

## Acceptance Criteria

- [x] A museum hub presents the exhibit and enters the portal.
- [x] A client-only habitat canvas mounts, renders, and disposes cleanly.
- [x] Keyboard, pointer, touch, and simplified controls can complete the vertical slice.
- [x] Reduced-motion mode communicates transformation without animation.
- [x] Pause, objective, notebook, exit, focus management, and live announcements work.

## Proposed Steps

1. Add the client-only Phaser mount and typed React/domain bridge.
2. Build the museum exhibit, portal transition, habitat HUD, and simplified-control surfaces.
3. Connect all controls to the deterministic domain engine and expose notebook evidence after return.
4. Add browser-level checks for portal entry, completion, exit, pause, and reduced-motion mode.

## Risks

- The canvas cannot grant durable evidence; it only presents verified domain state.
- Required actions need a DOM-accessible alternative.

## Out of Scope

- OpenAI API integration, database persistence, additional zones, second portal, Allosaurus playable form, voice, multiplayer, and real museum assets.

## Evidence

- Format, lint, strict typecheck, nine unit tests, content validation, and production build passed on 2026-07-17.
- Playwright verified the complete desktop and mobile flow, mounted canvas, reduced-motion path, pause/resume, and notebook return without page errors.

## Completion

- [x] Self-review
- [x] Independent code review
- [x] Human acceptance / owner-directed pause
- [x] `STATUS.md` updated

## Hibernation

The project is paused after Stage 3. See [docs/HIBERNATION.md](docs/HIBERNATION.md) for the resume sequence, blockers, security rules, and submission checklist.
