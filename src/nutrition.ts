import type {
  ActivityLevel,
  DailyProgress,
  DailyStatus,
  FoodFormValues,
  GoalMode,
  MealLogItem,
  NutritionTargets,
  NutritionTotals,
  UserProfile,
} from "./types";

export const emptyTotals: NutritionTotals = {
  calories: 0,
  proteinGrams: 0,
  carbGrams: 0,
  fatGrams: 0,
};

export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const goalAdjustments: Record<GoalMode, number> = {
  build: 1.1,
  shred: 0.82,
  maintain: 1,
};

export function isoToday(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function makeId(prefix: string): string {
  return `${prefix}-${globalThis.crypto.randomUUID()}`;
}

export function round(value: number): number {
  return Math.round(value);
}

export function clampNonNegative(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export function estimateMaintenanceCalories(profile: UserProfile): number {
  const heightCm = profile.heightInches * 2.54;
  const weightKg = profile.weightLbs * 0.45359237;
  const sexOffset = profile.sex === "female" ? -161 : profile.sex === "male" ? 5 : -78;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * profile.age + sexOffset;

  return round(bmr * activityMultipliers[profile.activityLevel]);
}

export function estimateTargets(
  profile: UserProfile,
  goalMode: GoalMode,
  date = isoToday(),
): NutritionTargets {
  const maintenanceCalories = estimateMaintenanceCalories(profile);
  const calories = round(maintenanceCalories * goalAdjustments[goalMode]);
  const proteinGrams = round(profile.weightLbs * (goalMode === "shred" ? 0.95 : 0.85));
  const fatCalories = calories * 0.27;
  const fatGrams = round(fatCalories / 9);
  const carbGrams = round((calories - proteinGrams * 4 - fatGrams * 9) / 4);

  return {
    goalMode,
    targetPace: goalMode === "maintain" ? "conservative" : "moderate",
    calculationMethod: "estimated",
    effectiveFrom: date,
    calories,
    proteinGrams,
    carbGrams: clampNonNegative(carbGrams),
    fatGrams,
  };
}

export function scaleFood(values: FoodFormValues): NutritionTotals {
  return {
    calories: clampNonNegative(values.calories * values.quantity),
    proteinGrams: clampNonNegative(values.proteinGrams * values.quantity),
    carbGrams: clampNonNegative(values.carbGrams * values.quantity),
    fatGrams: clampNonNegative(values.fatGrams * values.quantity),
  };
}

export function sumMealItems(items: MealLogItem[]): NutritionTotals {
  return items.reduce(
    (totals, item) => ({
      calories: totals.calories + item.calories,
      proteinGrams: totals.proteinGrams + item.proteinGrams,
      carbGrams: totals.carbGrams + item.carbGrams,
      fatGrams: totals.fatGrams + item.fatGrams,
    }),
    emptyTotals,
  );
}

export function calculateStatus(consumedCalories: number, targetCalories: number): DailyStatus {
  if (targetCalories <= 0) {
    return "under";
  }

  const ratio = consumedCalories / targetCalories;

  if (ratio < 0.85) {
    return "under";
  }

  if (ratio <= 1) {
    return "on_track";
  }

  if (ratio <= 1.1) {
    return "near_limit";
  }

  return "over";
}

export function calculateDailyProgress(
  date: string,
  target: NutritionTargets,
  logs: MealLogItem[],
): DailyProgress {
  const consumed = sumMealItems(logs.filter((item) => item.date === date));
  const remaining = {
    calories: target.calories - consumed.calories,
    proteinGrams: target.proteinGrams - consumed.proteinGrams,
    carbGrams: target.carbGrams - consumed.carbGrams,
    fatGrams: target.fatGrams - consumed.fatGrams,
  };
  const percentComplete = {
    calories: target.calories > 0 ? consumed.calories / target.calories : 0,
    proteinGrams: target.proteinGrams > 0 ? consumed.proteinGrams / target.proteinGrams : 0,
    carbGrams: target.carbGrams > 0 ? consumed.carbGrams / target.carbGrams : 0,
    fatGrams: target.fatGrams > 0 ? consumed.fatGrams / target.fatGrams : 0,
  };

  return {
    date,
    target,
    consumed,
    remaining,
    percentComplete,
    status: calculateStatus(consumed.calories, target.calories),
  };
}

export function validateFood(values: FoodFormValues): string | null {
  if (!values.name.trim()) {
    return "Food name is required.";
  }

  if (values.quantity <= 0 || !Number.isFinite(values.quantity)) {
    return "Quantity must be greater than 0.";
  }

  const fields = [values.calories, values.proteinGrams, values.carbGrams, values.fatGrams];
  if (fields.some((field) => field < 0 || !Number.isFinite(field))) {
    return "Nutrition values cannot be negative.";
  }

  return null;
}
