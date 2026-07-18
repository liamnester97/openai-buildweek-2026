# Start Here — AI Night at the Museum Exhibit Portal Revision

This package contains the controlled version 2.0 execution baseline.

## Codex startup sequence

1. Copy `docs/` into the project repository.
2. Create or update the repository-root `AGENTS.md` using Appendix A of `docs/EXECUTION_PLAN.md`.
3. Ask Codex to read `AGENTS.md` and `docs/EXECUTION_PLAN.md` before changing code.
4. Begin at **Stage 0 — Concept, Research, Rights, and Content Freeze**.
5. Copy that stage's `/goal` block into Codex.
6. Use `/plan` only for the next bounded vertical slice.
7. Do not begin a second portal until the first Stegosaurus portal passes its full acceptance and review gates.
8. Keep deterministic game truth in the shared TypeScript domain; neither GPT nor Phaser may grant durable progress directly.

The PDF is the human-readable controlled baseline. The Markdown file is the implementation source Codex should search and quote.
