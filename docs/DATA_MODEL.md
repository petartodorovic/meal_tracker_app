# Data Model

## Core Entities

### UserProfile

```ts
type UserProfile = {
  id: string;
  displayName?: string;
  age?: number;
  sex?: "female" | "male" | "unspecified";
  heightInches?: number;
  weightLbs?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  trainingDaysPerWeek?: number;
  createdAt: string;
  updatedAt: string;
};
```

### GoalMode

```ts
type GoalMode = "build" | "shred" | "maintain";
```

### NutritionTargets

```ts
type NutritionTargets = {
  id: string;
  userId: string;
  goalMode: GoalMode;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  targetPace?: "conservative" | "moderate";
  calculationMethod: "estimated" | "manual";
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
};
```

### Food

Saved reusable food.

```ts
type Food = {
  id: string;
  name: string;
  brand?: string;
  servingLabel?: string;
  servingQuantity?: number;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  createdAt: string;
  updatedAt: string;
};
```

### MealLog

```ts
type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "custom";

type MealLog = {
  id: string;
  userId: string;
  date: string;
  mealType: MealType;
  name?: string;
  items: MealLogItem[];
  createdAt: string;
  updatedAt: string;
};
```

### MealLogItem

```ts
type MealLogItem = {
  id: string;
  foodId?: string;
  name: string;
  quantity: number;
  servingLabel?: string;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  createdAt: string;
  updatedAt: string;
};
```

## Derived Types

### NutritionTotals

```ts
type NutritionTotals = {
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
};
```

### DailyProgress

```ts
type DailyProgress = {
  date: string;
  target: NutritionTargets;
  consumed: NutritionTotals;
  remaining: NutritionTotals;
  percentComplete: NutritionTotals;
  status: "under" | "on_track" | "near_limit" | "over";
};
```

## Calculation Rules

### Item Totals

If a user enters nutrition values for one serving and sets quantity to 2, multiply all nutrition values by 2.

```ts
itemTotal = perServingValue * quantity
```

### Daily Consumed

Sum every meal log item for the selected date.

```ts
consumed.calories = sum(items.calories)
consumed.proteinGrams = sum(items.proteinGrams)
consumed.carbGrams = sum(items.carbGrams)
consumed.fatGrams = sum(items.fatGrams)
```

### Remaining

```ts
remaining = target - consumed
```

Remaining values may be negative when the user exceeds target. Display negative values clearly.

### Percent Complete

```ts
percentComplete = consumed / target
```

Guard against divide-by-zero if targets are missing or invalid.

### Daily Status

Suggested calorie thresholds:

- Under: less than 85% of target.
- On track: 85-100% of target.
- Near limit: 100-110% of target.
- Over: greater than 110% of target.

Protein should be treated differently: reaching or exceeding protein target is usually positive unless the app later introduces advanced constraints.

## Validation Rules

- Calories must be greater than or equal to 0.
- Macro grams must be greater than or equal to 0.
- Quantity must be greater than 0.
- Date must be a valid ISO date string.
- A food item must have a non-empty name.
- Targets should be editable even if profile fields are incomplete.

## Storage Notes

MVP can use local storage or IndexedDB. Prefer a repository/service layer so storage can later move to a backend without rewriting UI logic.

