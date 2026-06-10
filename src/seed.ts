import { estimateTargets, isoToday } from "./nutrition";
import type { AppState, Food, MealLogItem, UserProfile } from "./types";

const now = new Date().toISOString();
const today = isoToday();

const demoProfile: UserProfile = {
  displayName: "Petar",
  age: 34,
  sex: "male",
  heightInches: 70,
  weightLbs: 180,
  activityLevel: "moderate",
  trainingDaysPerWeek: 4,
};

export const demoFoods: Food[] = [
  {
    id: "food-greek-yogurt",
    name: "Greek yogurt",
    servingLabel: "1 cup",
    calories: 140,
    proteinGrams: 24,
    carbGrams: 8,
    fatGrams: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "food-chicken-rice",
    name: "Chicken and rice bowl",
    servingLabel: "1 bowl",
    calories: 520,
    proteinGrams: 44,
    carbGrams: 58,
    fatGrams: 12,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "food-protein-shake",
    name: "Protein shake",
    servingLabel: "1 shake",
    calories: 210,
    proteinGrams: 32,
    carbGrams: 10,
    fatGrams: 5,
    createdAt: now,
    updatedAt: now,
  },
];

export const demoLogs: MealLogItem[] = [
  {
    id: "log-yogurt",
    foodId: "food-greek-yogurt",
    name: "Greek yogurt",
    quantity: 1,
    servingLabel: "1 cup",
    mealType: "breakfast",
    date: today,
    calories: 140,
    proteinGrams: 24,
    carbGrams: 8,
    fatGrams: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "log-chicken-rice",
    foodId: "food-chicken-rice",
    name: "Chicken and rice bowl",
    quantity: 1,
    servingLabel: "1 bowl",
    mealType: "lunch",
    date: today,
    calories: 520,
    proteinGrams: 44,
    carbGrams: 58,
    fatGrams: 12,
    createdAt: now,
    updatedAt: now,
  },
];

export function createDemoState(): AppState {
  return {
    onboardingComplete: true,
    profile: demoProfile,
    targets: estimateTargets(demoProfile, "build", today),
    foods: demoFoods,
    logs: demoLogs,
  };
}

