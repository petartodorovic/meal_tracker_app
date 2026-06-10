export type GoalMode = "build" | "shred" | "maintain";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type UserProfile = {
  displayName: string;
  age: number;
  sex: "female" | "male" | "unspecified";
  heightInches: number;
  weightLbs: number;
  activityLevel: ActivityLevel;
  trainingDaysPerWeek: number;
};

export type NutritionTotals = {
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
};

export type NutritionTargets = NutritionTotals & {
  goalMode: GoalMode;
  targetPace: "conservative" | "moderate";
  calculationMethod: "estimated" | "manual";
  effectiveFrom: string;
};

export type Food = NutritionTotals & {
  id: string;
  name: string;
  servingLabel: string;
  createdAt: string;
  updatedAt: string;
};

export type MealLogItem = NutritionTotals & {
  id: string;
  foodId?: string;
  name: string;
  quantity: number;
  servingLabel: string;
  mealType: MealType;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type DailyStatus = "under" | "on_track" | "near_limit" | "over";

export type DailyProgress = {
  date: string;
  target: NutritionTargets;
  consumed: NutritionTotals;
  remaining: NutritionTotals;
  percentComplete: NutritionTotals;
  status: DailyStatus;
};

export type AppState = {
  onboardingComplete: boolean;
  profile?: UserProfile;
  targets?: NutritionTargets;
  foods: Food[];
  logs: MealLogItem[];
};

export type FoodFormValues = {
  name: string;
  mealType: MealType;
  quantity: number;
  servingLabel: string;
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  saveToFoods: boolean;
};

