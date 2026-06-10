# Agent Build Brief

## Build Intent

Build a practical meal tracker centered on goal-based macronutrient progress. The app should feel like a daily operating surface, not a marketing site. The first screen after onboarding should be the user's dashboard for today.

## Product Principles

- Make progress obvious at a glance.
- Keep food logging fast and forgiving.
- Make calculated targets editable.
- Prefer clarity over motivational clutter.
- Avoid shame-based language.
- Show actionable remaining intake, not only consumed intake.

## MVP Experience

When a user opens the app, they should immediately understand:

- Their selected goal mode.
- Today's calorie progress.
- Today's protein, carb, and fat progress.
- What meals have been logged.
- What they likely still need to eat to hit the day well.

## Suggested Information Architecture

- Today
- Log
- History
- Foods
- Settings

## Recommended App Shape

For a web app MVP:

- Use a responsive single-page app.
- Persist data locally first unless the project already has auth/backend requirements.
- Keep nutrition calculations in a dedicated utility module.
- Keep data model types explicit.
- Use deterministic seeded sample data for development/demo mode.

## UI Guidance

- Use dense, scannable dashboard layouts.
- Use progress bars, compact stat blocks, and meal rows.
- Use tabs or segmented controls for meal periods.
- Use icon buttons for edit, duplicate, delete, and navigation actions.
- Use forms with clear numeric inputs for food entry.
- Avoid a landing page unless explicitly requested.
- Avoid decorative hero sections, oversized marketing copy, and purely aesthetic cards.

## Tone

Use direct, neutral, supportive language:

- "You have 42g protein remaining."
- "Calories are slightly under target."
- "This day is within range."

Avoid:

- "Bad food"
- "Cheat meal"
- "Failed"
- "Burn it off"

## Technical Expectations

- Isolate macro math from UI components.
- Validate numeric inputs.
- Do not allow negative nutrition values.
- Store dates as ISO date strings for daily logs.
- Round display values consistently.
- Preserve full precision internally where practical.
- Make all goal assumptions visible in settings.

## Build Order

1. Data types and calculation utilities.
2. Onboarding target setup.
3. Today dashboard.
4. Meal logging.
5. Saved foods and duplication.
6. History and weekly summaries.
7. Settings and target editing.

## Agent Acceptance Checklist

- User can complete onboarding.
- User can log at least one food item.
- Dashboard updates immediately after logging.
- Remaining calories and macros are correct.
- User can edit and delete logged items.
- User can view at least seven days of history.
- User can change goal mode and targets.
- Empty, loading, and error states are handled.

