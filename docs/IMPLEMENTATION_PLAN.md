# Implementation Plan

## Phase 0: Product Decisions

Resolve or make explicit defaults for:

- Single-user vs multi-user.
- Local-only vs cloud-backed persistence.
- Imperial-only vs metric support.
- Manual food entry only vs nutrition database integration.
- Whether weight tracking is included in MVP.

Recommended MVP defaults:

- Single-user.
- Local-first persistence.
- Imperial units first.
- Manual food entry plus saved foods.
- No weight tracking in first pass unless specifically requested.

## Phase 1: Foundation

### Build

- Define TypeScript types or equivalent domain models.
- Implement macro calculation utilities.
- Implement target estimation utilities.
- Implement storage/repository layer.
- Add deterministic seed data for local development.

### Acceptance Criteria

- Calculation functions have unit tests.
- Daily totals are correct for multiple meals.
- Remaining values can go negative.
- Target estimation can be manually overridden.

## Phase 2: Onboarding

### Build

- Goal mode selector.
- Profile form.
- Target recommendation screen.
- Manual target editor.
- Persist completed onboarding state.

### Acceptance Criteria

- User can complete onboarding without optional fields.
- User can select build, shred, or maintain.
- User can accept suggested targets.
- User can manually edit targets before saving.

## Phase 3: Today Dashboard

### Build

- Today page layout.
- Nutrition progress components.
- Meal grouping.
- Empty state.
- Date selection.

### Acceptance Criteria

- Today dashboard displays the active target.
- Dashboard displays consumed and remaining calories/macros.
- Empty state is useful and includes add action.
- Changing dates loads the correct logs.

## Phase 4: Food Logging

### Build

- Add food form.
- Edit food log item.
- Delete food log item.
- Duplicate recent item.
- Save food toggle.

### Acceptance Criteria

- User can add a food item to a meal.
- User can edit and delete logged items.
- User can duplicate a recent item.
- Dashboard updates after every change.
- Invalid numeric input is prevented or clearly handled.

## Phase 5: Saved Foods

### Build

- Saved foods list.
- Search/filter.
- Add/edit/delete saved foods.
- Add saved food to today's log.

### Acceptance Criteria

- Saved food can be reused in a meal log.
- Editing a saved food does not unexpectedly rewrite historical meal logs.
- Empty state explains how saved foods appear.

## Phase 6: History

### Build

- Recent days list.
- Day detail view.
- Weekly average summary.
- Target range status by day.

### Acceptance Criteria

- User can review at least the last 7 days.
- Weekly averages match daily logs.
- Days are clearly marked under, on track, near limit, or over.

## Phase 7: Settings

### Build

- Edit profile.
- Change goal mode.
- Change targets.
- Data reset/export if appropriate.

### Acceptance Criteria

- Target edits preserve historical logs.
- Goal mode change updates future dashboard framing.
- User can recover from incorrect onboarding assumptions.

## Suggested Test Coverage

- Macro totals.
- Remaining macro calculation.
- Status threshold calculation.
- Target estimation by goal mode.
- Food item quantity multiplication.
- Persistence read/write.
- Onboarding completion.
- Add/edit/delete log item.

## Future Enhancements

- Weight check-ins and trend visualization.
- Barcode scanning.
- Food database search.
- Recipe builder.
- Meal templates.
- AI meal parsing from text.
- Photo-based food estimation.
- Shared household meals.
- Cloud sync and account auth.

