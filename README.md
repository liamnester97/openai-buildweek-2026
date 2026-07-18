# AI Night at the Museum: The Memory Beneath the Bones

OpenAI Build Week 2026 project workspace for an original, accessible browser game about evidence, uncertainty, and prehistoric ecosystems. A visitor enters a fictional nighttime museum exhibit, becomes a young Stegosaurus inside a portal memory, and returns with evidence to reconstruct an explicitly fictional event.

## Current Status

Stage 0 scope is approved. Stages 1-3 provide the strict TypeScript baseline, tested deterministic museum-to-portal domain slice, and accessible playable UI. The project is currently paused after Stage 3. Read [PLAN.md](PLAN.md), [STATUS.md](STATUS.md), [DECISIONS.md](DECISIONS.md), and the [hibernation plan](docs/HIBERNATION.md) before changing the project.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The health endpoint is `http://localhost:3000/api/health`.

## Quality Checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run content:validate
npm run build
```

Copy `.env.example` to `.env.local` only when a later stage needs environment configuration. No OpenAI integration or secret is used in this bootstrap stage.

## Continuous Integration and Deployment

GitHub Actions runs the same quality checks for pushes to `main` and pull requests. See [deployment setup](docs/DEPLOYMENT.md) for the Vercel preview prerequisite.

## Source Baseline

The supplied master plan is retained in `AI_Night_at_the_Museum_Exhibit_Portal_Codex_Package_v2/docs/EXECUTION_PLAN.md`. Stage 0 deliverables live in `docs/`.

## Challenge Notes

The current Devpost deadline is July 21, 2026 at 5:00 PM PDT. See [docs/BUILD_WEEK_REQUIREMENTS.md](docs/BUILD_WEEK_REQUIREMENTS.md) for the verified submission checklist.
