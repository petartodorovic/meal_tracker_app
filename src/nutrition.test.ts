import { describe, expect, it } from "vitest";
import {
  calculateDailyProgress,
  calculateStatus,
  estimateTargets,
  scaleFood,
  sumMealItems,
} from "./nutrition";
import type { FoodFormValues, MealLogItem, UserProfile } from "./types";

const profile: UserProfile = {
  displayName: "Test",
  age: 32,
  sex: "male",
  heightInches: 70,
  weightLbs: 180,
  activityLevel: "moderate",
  trainingDaysPerWeek: 4,
};

const logItem: MealLogItem = {
  id: "log-1",
  name: "Meal",
  quantity: 1,
  servingLabel: "serving",
  mealType: "lunch",
  date: "2026-06-10",
  calories: 500,
  proteinGrams: 40,
  carbGrams: 55,
  fatGrams: 12,
  createdAt: "2026-06-10T00:00:00.000Z",
  updatedAt: "2026-06-10T00:00:00.000Z",
};

describe("nutrition", () => {
  it("estimates different calorie targets by goal mode", () => {
    const build = estimateTargets(profile, "build");
    const maintain = estimateTargets(profile, "maintain");
    const shred = estimateTargets(profile, "shred");

    expect(build.calories).toBeGreaterThan(maintain.calories);
    expect(shred.calories).toBeLessThan(maintain.calories);
  });

  it("scales food values by quantity", () => {
    const values: FoodFormValues = {
      name: "Eggs",
      mealType: "breakfast",
      quantity: 2,
      servingLabel: "2 eggs",
      calories: 150,
      proteinGrams: 12,
      carbGrams: 1,
      fatGrams: 10,
      saveToFoods: false,
    };

    expect(scaleFood(values)).toEqual({
      calories: 300,
      proteinGrams: 24,
      carbGrams: 2,
      fatGrams: 20,
    });
  });

  it("sums multiple meal items", () => {
    expect(sumMealItems([logItem, logItem])).toEqual({
      calories: 1000,
      proteinGrams: 80,
      carbGrams: 110,
      fatGrams: 24,
    });
  });

  it("allows remaining values to go negative", () => {
    const progress = calculateDailyProgress(
      "2026-06-10",
      {
        goalMode: "maintain",
        targetPace: "conservative",
        calculationMethod: "manual",
        effectiveFrom: "2026-06-10",
        calories: 400,
        proteinGrams: 30,
        carbGrams: 50,
        fatGrams: 10,
      },
      [logItem],
    );

    expect(progress.remaining.calories).toBe(-100);
    expect(progress.remaining.proteinGrams).toBe(-10);
  });

  it("classifies calorie status by threshold", () => {
    expect(calculateStatus(800, 1000)).toBe("under");
    expect(calculateStatus(900, 1000)).toBe("on_track");
    expect(calculateStatus(1050, 1000)).toBe("near_limit");
    expect(calculateStatus(1200, 1000)).toBe("over");
  });
});

