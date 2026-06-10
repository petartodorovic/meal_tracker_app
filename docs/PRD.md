# Product Requirements Document

## Product Name

Working name: Macronaut

## Problem

People who track meals often know what they ate but still struggle to understand whether their choices match their larger goal. Generic calorie trackers can feel noisy, punitive, or overly database-driven. This app should make daily nutrition decisions easier by connecting food logging directly to a chosen goal: build, shred, or maintain.

## Product Vision

Create a focused meal tracker that helps users define nutrition goals, log meals quickly, view macro progress clearly, and understand whether their current intake supports their target body composition direction.

## Target Users

- Strength trainees trying to bulk with enough protein and calories.
- People trying to lose fat while preserving muscle.
- Health-conscious users who want macro visibility without an overwhelming fitness app.
- Couples, roommates, or families who may want shared meals but personal targets later.

## Goals

- Let users choose a goal mode: build/bulk, shred/cut, or maintain.
- Help users set calorie and macro targets during onboarding.
- Track daily intake by meal and food item.
- Show remaining calories and macros for the current day.
- Provide clear feedback about whether the user is under, on track, or over target.
- Preserve historical data so users can evaluate consistency over time.

## Non-Goals For MVP

- Medical nutrition guidance.
- Meal plan generation.
- Barcode scanning.
- Restaurant menu importing.
- Wearable integrations.
- Social feeds or public sharing.
- AI-based food recognition from images.

## Core User Stories

- As a new user, I want to select whether I am building, shredding, or maintaining so the app can frame my targets correctly.
- As a user, I want to enter my starting profile and activity assumptions so I can get a reasonable starting calorie target.
- As a user, I want to customize my calories and macros because I may already know my numbers.
- As a user, I want to log a meal quickly so tracking does not interrupt my day.
- As a user, I want to see calories, protein, carbs, and fat remaining so I know what to eat next.
- As a user, I want to review trends over days and weeks so I can see whether I am consistent.

## MVP Scope

### Onboarding

- Goal mode selection: build, shred, maintain.
- Basic profile inputs:
  - Age
  - Sex or body composition formula preference
  - Height
  - Weight
  - Activity level
  - Training frequency
- Optional manual override for calorie and macro targets.
- Target pace:
  - Build: conservative surplus, moderate surplus.
  - Shred: conservative deficit, moderate deficit.
  - Maintain: stable intake.

### Daily Dashboard

- Current date.
- Goal mode badge.
- Calories consumed vs target.
- Protein, carbohydrates, and fat consumed vs target.
- Remaining macros.
- Meal list grouped by breakfast, lunch, dinner, snack, or custom meal.
- Status indicator:
  - Under target
  - On track
  - Near limit
  - Over target

### Food And Meal Logging

- Add food item manually:
  - Name
  - Serving quantity
  - Calories
  - Protein grams
  - Carbohydrate grams
  - Fat grams
- Add item to a meal.
- Edit or delete logged item.
- Duplicate a previous meal or item.
- Save simple reusable foods.

### History And Progress

- Daily history list or calendar.
- Weekly average calories and macros.
- Consistency summary:
  - Days tracked
  - Days within target range
  - Average protein completion

### Settings

- Update goal mode.
- Update calorie and macro targets.
- Update profile assumptions.
- Units: imperial first, metric later if needed.

## Nutrition Logic

The app should make calculations transparent and editable.

Suggested defaults:

- Protein: 0.7-1.0 grams per pound of body weight.
- Fat: 20-35% of calories.
- Carbohydrates: remaining calories after protein and fat.
- Build: maintenance calories plus 5-15%.
- Shred: maintenance calories minus 10-25%.
- Maintain: estimated maintenance calories.

Maintenance calorie estimation can begin with Mifflin-St Jeor or a simple bodyweight multiplier. For MVP, prioritize explainability and user override over perfect precision.

## Success Metrics

- New user completes onboarding.
- User logs at least one meal on first day.
- User returns within 3 days.
- User logs meals on 4 or more days in the first week.
- User views historical progress at least once in the first week.

## Risks

- Nutrition calculations can be perceived as medical advice.
- Food logging can become tedious if manual entry is too slow.
- Users may mistrust default target calculations.
- Too many charts too early can make the app feel heavier than necessary.

## Open Questions

- Should the app support multiple household members or only one profile at MVP?
- Should users be able to define macro targets by grams, percentages, or both?
- Should weigh-ins be tracked in MVP?
- Should the product use a local-first model, cloud sync, or account-based storage from the beginning?
- Should foods be entirely manual at first, or should we integrate a nutrition database early?

