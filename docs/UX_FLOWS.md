# UX Flows

## Primary Navigation

- Today
- Log
- History
- Foods
- Settings

## Onboarding Flow

1. Welcome and goal selection.
2. Profile basics.
3. Activity and training assumptions.
4. Suggested calorie and macro targets.
5. Manual edit screen.
6. Confirmation and entry to Today dashboard.

### Goal Selection

Goal cards or segmented controls:

- Build: controlled surplus.
- Shred: controlled deficit.
- Maintain: stable intake.

The selected goal should change the language around targets, but the user must always be able to override numbers.

## Today Dashboard

### Required Elements

- Date selector.
- Goal mode label.
- Calories consumed, target, and remaining.
- Protein, carbs, and fat progress.
- Meal sections.
- Add food action.
- Quick duplicate from recent foods or meals.

### Empty State

If no meals are logged:

- Show target summary.
- Show an obvious add food action.
- Optionally show recent foods if any exist.

### Progress Display

Use compact visual indicators:

- Calories: primary progress bar or radial meter.
- Protein/carbs/fat: horizontal bars or small stat rows.
- Remaining values should be more prominent than percentages.

## Log Food Flow

1. User taps add food.
2. User chooses meal type.
3. User enters or searches food name.
4. User enters serving quantity and nutrition.
5. User saves.
6. Dashboard updates immediately.

### Form Fields

- Food name.
- Meal type.
- Quantity.
- Serving label.
- Calories.
- Protein grams.
- Carbohydrate grams.
- Fat grams.
- Save to foods toggle.

### Editing

Users can edit any logged item from the meal row. Editing should update daily totals immediately.

### Deleting

Deletion should ask for lightweight confirmation or provide undo. Avoid making users re-enter food after accidental taps.

## Saved Foods Flow

### Foods Screen

- List saved foods.
- Search/filter by name.
- Add new saved food.
- Edit saved food.
- Delete saved food.
- Add saved food to today's log.

Saved foods should speed up repeated meals without requiring database-grade food management.

## History Flow

### History Screen

- List recent days.
- Show calories and macro completion per day.
- Include weekly average summary.
- Allow selecting a day to view details.

### Weekly Summary

Suggested stats:

- Average calories.
- Average protein.
- Days tracked.
- Days within calorie range.
- Goal mode used that week.

## Settings Flow

### Settings Sections

- Profile.
- Goal mode.
- Nutrition targets.
- Units.
- Data management.

### Target Editing

When a user changes targets, preserve historical logs. New targets should take effect from the selected effective date.

## Important States

- First-run onboarding.
- No meals logged today.
- Day partially tracked.
- Day over calorie target.
- Protein target met.
- Offline or local-only mode.
- Invalid food entry.
- Empty saved foods list.
- Empty history list.

## Accessibility Notes

- Do not rely on color alone for status.
- Use clear labels for progress values.
- Make all numeric inputs keyboard-friendly.
- Support mobile one-handed logging.
- Ensure tap targets are comfortable on mobile.

