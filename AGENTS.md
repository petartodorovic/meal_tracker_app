# AGENTS.md

## Purpose

This repository is the working home for the meal tracker product and implementation. The app helps users pick a goal mode, set macro targets, log meals, and understand whether they are on track for the day.

## Source Of Truth

- Product requirements live in `docs/PRD.md`.
- Agent guidance lives in `docs/AGENT_BRIEF.md`.
- Data shapes and calculation rules live in `docs/DATA_MODEL.md`.
- UX flow details live in `docs/UX_FLOWS.md`.
- Delivery sequencing lives in `docs/IMPLEMENTATION_PLAN.md`.
- Repository-local skills live in `.codex/skills/README.md`.
- The bundled system skills are available under `.codex/skills/.system/`.
- Project skills `delegate` and `gather` live under `.codex/skills/`.

## Working Rules

- Read the docs before changing product behavior.
- Keep changes aligned to the current MVP unless the user explicitly broadens scope.
- Prefer small, explainable increments over sweeping rewrites.
- Preserve the user-facing distinction between `build`, `shred`, and `maintain`.
- Make macro math deterministic and testable.
- Keep nutrition calculations in a dedicated module or service layer.
- Treat manual target overrides as first-class behavior, not an edge case.

## Build Priorities

1. Data model and calculation utilities.
2. Onboarding and target setup.
3. Today dashboard.
4. Meal logging.
5. Saved foods.
6. History and weekly summaries.
7. Settings and target editing.

## UI Principles

- The app should feel like a daily operating surface, not a marketing site.
- Show calories, protein, carbs, and fat clearly.
- Show remaining intake, not only consumed intake.
- Keep logging fast and forgiving.
- Use calm, direct language.
- Avoid shame-based copy.

## Engineering Conventions

- The v0 app stack is React, Vite, and TypeScript.
- App source lives in `src/`.
- Keep the app local-first unless the user explicitly asks for auth or backend storage.
- Use explicit types for core domain objects.
- Store dates as ISO strings.
- Reject negative calories and macro values.
- Round display values consistently.
- Preserve precision internally when possible.
- Keep validation close to the input boundary.
- Keep derived values separate from persisted user input.

## Verification

- Validate macro totals with tests.
- Validate remaining/over-target calculations with tests.
- Validate goal target calculations with tests.
- Verify empty states for onboarding, dashboard, foods, and history.
- Verify edits update totals immediately.

## Communication

- When you make assumptions, state them plainly.
- When there are product tradeoffs, call them out before locking them in.
- If a requested change affects the MVP boundary, flag it.

## Project Name

The repository is named `meal_tracker_app`.
