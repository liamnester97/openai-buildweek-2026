# ADR-002: Deterministic Game Truth, AI Interpretation Only

Date: 2026-07-17

## Decision

The game domain owns portal transitions, form, mini-game completion, evidence, persistence, and endings. GPT-5.6 interprets natural language and composes narration from verified results only.

## Rationale

The experience needs flexible conversation without allowing model output to award progress, invent evidence, or violate the museum/portal state machine.

## Consequences

Every state change is a typed, validated, idempotent domain command. The application must retain a deterministic demo path when AI is unavailable.
