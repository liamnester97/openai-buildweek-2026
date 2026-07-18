# Deployment

## Stage 1 Status

The project is a standard Next.js application and is ready to deploy to Vercel without custom build configuration.

Current blocker: no Vercel account or project connection is available in this session. A preview URL cannot be created until the repository is linked to a Vercel project.

## Vercel Setup

1. Import `liamnester97/openai-buildweek-2026` into Vercel.
2. Leave the framework preset as Next.js and use the repository root as the root directory.
3. Do not add OpenAI or database secrets during Stage 1.
4. Enable preview deployments for pull requests and production deployment from `main`.
5. Add future secrets only in Vercel's encrypted environment-variable settings, never in the repository.

## Verification

After linking, confirm that a preview deployment serves `/` and `/api/health`, then record the URL in `STATUS.md`.
