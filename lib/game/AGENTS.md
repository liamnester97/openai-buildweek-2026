# Game Domain Instructions

The game domain owns museum/portal world mode, player form, semantic checkpoints, mini-game completion, memory fragments, evidence, reconstruction, and endings.

- Do not import React, a canvas runtime, an OpenAI SDK, database clients, or network code.
- Commands are explicit and narrow; events are immutable and versioned.
- Transitions and fragment rewards must be guarded, idempotent, deterministic, and tested.
- Canvas coordinates and animation completion cannot award durable truth.
