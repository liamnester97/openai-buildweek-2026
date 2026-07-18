# Initial Risk Register

| ID  | Risk                                                                     | Likelihood | Impact | Mitigation                                                                                     | Owner                  |
| --- | ------------------------------------------------------------------------ | ---------- | ------ | ---------------------------------------------------------------------------------------------- | ---------------------- |
| R01 | Scope exceeds the July 21 deadline.                                      | High       | High   | One portal, one form, four evidence concepts; cut stretch work first.                          | Product owner          |
| R02 | Fictional behavior is mistaken for scientific fact.                      | Medium     | High   | Confidence labels, explicit fictional framing, science review before player-facing copy.       | Science reviewer       |
| R03 | Real museum identity or assets are copied.                               | Medium     | High   | Original gallery, asset ledger, no logo/floor plan/plaque/photo/audio reuse.                   | Rights reviewer        |
| R04 | AI bypasses deterministic progress.                                      | Medium     | High   | No mutating AI tools; validate intent, execute in domain engine, compose verified result only. | Engineering owner      |
| R05 | Canvas excludes keyboard, touch, reduced-motion, or screen-reader users. | Medium     | High   | DOM-accessible alternatives, simplified controls, untimed path, test before AI integration.    | Accessibility reviewer |
| R06 | API outage makes the game unplayable.                                    | Medium     | Medium | Deterministic suggested actions and template narration in demo mode.                           | Engineering owner      |
| R07 | Submission materials are incomplete.                                     | Medium     | High   | Track README, demo, repository visibility, and `/feedback` ID from Stage 1 onward.             | Product owner          |
| R08 | Bootstrap dependency audit reports a moderate PostCSS XSS advisory.      | Low        | Medium | Do not process untrusted CSS; monitor Next.js for a compatible dependency update.              | Engineering owner      |
