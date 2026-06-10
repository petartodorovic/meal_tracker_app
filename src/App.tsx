import {
  Activity,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  Flame,
  History,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Sparkles,
  Target,
  Trash2,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  calculateDailyProgress,
  estimateTargets,
  isoToday,
  makeId,
  round,
  scaleFood,
  validateFood,
} from "./nutrition";
import { createDemoState, demoFoods } from "./seed";
import { loadState, resetState, saveState } from "./storage";
import type {
  AppState,
  Food,
  FoodFormValues,
  GoalMode,
  MealLogItem,
  MealType,
  NutritionTargets,
  UserProfile,
} from "./types";

type View = "today" | "log" | "history" | "foods" | "settings";

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const defaultProfile: UserProfile = {
  displayName: "",
  age: 34,
  sex: "male",
  heightInches: 70,
  weightLbs: 180,
  activityLevel: "moderate",
  trainingDaysPerWeek: 4,
};

const defaultFoodForm: FoodFormValues = {
  name: "",
  mealType: "breakfast",
  quantity: 1,
  servingLabel: "1 serving",
  calories: 0,
  proteinGrams: 0,
  carbGrams: 0,
  fatGrams: 0,
  saveToFoods: true,
};

const goalLabels: Record<GoalMode, string> = {
  build: "Build",
  shred: "Shred",
  maintain: "Maintain",
};

const statusLabels = {
  under: "Under target",
  on_track: "On track",
  near_limit: "Near limit",
  over: "Over target",
};

type TrendPoint = {
  day: string;
  calories: number;
  proteinGrams: number;
  adherence: number;
};

const mealSuggestions = [
  {
    mealType: "Breakfast",
    title: "Greek yogurt power bowl",
    detail: "Greek yogurt, berries, oats, chia, honey",
    macros: "430 cal · 36p · 52c · 9f",
  },
  {
    mealType: "Breakfast",
    title: "Eggs and avocado toast",
    detail: "2 eggs, sourdough, avocado, fruit",
    macros: "520 cal · 28p · 48c · 24f",
  },
  {
    mealType: "Lunch",
    title: "Chicken rice bowl",
    detail: "Chicken breast, jasmine rice, salsa, greens",
    macros: "650 cal · 52p · 74c · 14f",
  },
  {
    mealType: "Lunch",
    title: "Turkey hummus wrap",
    detail: "Turkey, hummus, greens, tomato, side apple",
    macros: "560 cal · 42p · 58c · 18f",
  },
  {
    mealType: "Snack",
    title: "Protein shake and banana",
    detail: "Whey, banana, almond milk",
    macros: "310 cal · 32p · 36c · 5f",
  },
  {
    mealType: "Dinner",
    title: "Salmon sweet potato plate",
    detail: "Salmon, roasted sweet potato, asparagus",
    macros: "690 cal · 46p · 58c · 28f",
  },
];

function createTrendData(targets: NutritionTargets): TrendPoint[] {
  const multipliers = [0.92, 0.98, 1.04, 0.89, 1.01, 0.96, 1.08, 0.94, 1.0, 1.06, 0.97, 0.91, 1.03, 0.99];
  const proteinMultipliers = [0.88, 0.94, 1.01, 0.9, 1.08, 0.97, 1.12, 0.95, 1.03, 1.06, 0.98, 0.92, 1.1, 1.04];

  return multipliers.map((multiplier, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - index));
    const calories = round(targets.calories * multiplier);
    const proteinGrams = round(targets.proteinGrams * proteinMultipliers[index]);
    const calorieScore = 1 - Math.min(Math.abs(calories - targets.calories) / targets.calories, 1);
    const proteinScore = Math.min(proteinGrams / targets.proteinGrams, 1);

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      calories,
      proteinGrams,
      adherence: round((calorieScore * 0.58 + proteinScore * 0.42) * 100),
    };
  });
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [activeView, setActiveView] = useState<View>("today");
  const [selectedDate, setSelectedDate] = useState(isoToday());

  useEffect(() => {
    saveState(state);
  }, [state]);

  if (!state.onboardingComplete || !state.profile || !state.targets) {
    return (
      <main className="app-shell onboarding-shell">
        <Onboarding
          onComplete={(profile, targets) => {
            setState({
              onboardingComplete: true,
              profile,
              targets,
              foods: demoFoods,
              logs: [],
            });
          }}
          onLoadDemo={() => setState(createDemoState())}
        />
      </main>
    );
  }

  const progress = calculateDailyProgress(selectedDate, state.targets, state.logs);

  function updateState(nextState: AppState) {
    setState(nextState);
  }

  function addFood(values: FoodFormValues) {
    const validationMessage = validateFood(values);
    if (validationMessage) {
      return validationMessage;
    }

    const now = new Date().toISOString();
    const scaled = scaleFood(values);
    const savedFoodId = values.saveToFoods ? makeId("food") : undefined;
    const logItem: MealLogItem = {
      id: makeId("log"),
      foodId: savedFoodId,
      name: values.name.trim(),
      quantity: values.quantity,
      servingLabel: values.servingLabel.trim() || "1 serving",
      mealType: values.mealType,
      date: selectedDate,
      createdAt: now,
      updatedAt: now,
      ...scaled,
    };

    const nextFoods =
      values.saveToFoods && savedFoodId
        ? [
            ...state.foods,
            {
              id: savedFoodId,
              name: values.name.trim(),
              servingLabel: values.servingLabel.trim() || "1 serving",
              calories: values.calories,
              proteinGrams: values.proteinGrams,
              carbGrams: values.carbGrams,
              fatGrams: values.fatGrams,
              createdAt: now,
              updatedAt: now,
            },
          ]
        : state.foods;

    updateState({ ...state, foods: nextFoods, logs: [logItem, ...state.logs] });
    return null;
  }

  function deleteLog(id: string) {
    updateState({ ...state, logs: state.logs.filter((item) => item.id !== id) });
  }

  function addSavedFoodToLog(food: Food, mealType: MealType) {
    const now = new Date().toISOString();
    const logItem: MealLogItem = {
      id: makeId("log"),
      foodId: food.id,
      name: food.name,
      quantity: 1,
      servingLabel: food.servingLabel,
      mealType,
      date: selectedDate,
      calories: food.calories,
      proteinGrams: food.proteinGrams,
      carbGrams: food.carbGrams,
      fatGrams: food.fatGrams,
      createdAt: now,
      updatedAt: now,
    };

    updateState({ ...state, logs: [logItem, ...state.logs] });
  }

  function deleteFood(id: string) {
    updateState({ ...state, foods: state.foods.filter((food) => food.id !== id) });
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Activity size={24} />
          </div>
          <div>
            <p className="eyebrow">MacroCompass</p>
            <h1>{goalLabels[state.targets.goalMode]} day</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          <NavButton view="today" activeView={activeView} onSelect={setActiveView} icon={<Target size={18} />} />
          <NavButton view="log" activeView={activeView} onSelect={setActiveView} icon={<Plus size={18} />} />
          <NavButton view="history" activeView={activeView} onSelect={setActiveView} icon={<History size={18} />} />
          <NavButton view="foods" activeView={activeView} onSelect={setActiveView} icon={<Utensils size={18} />} />
          <NavButton view="settings" activeView={activeView} onSelect={setActiveView} icon={<Settings size={18} />} />
        </nav>

        <div className="sidebar-panel">
          <p className="eyebrow">Today</p>
          <strong>{statusLabels[progress.status]}</strong>
          <span>{round(progress.remaining.calories)} calories remaining</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Macro command center</p>
            <h2>{state.profile.displayName || "Your"} nutrition board</h2>
          </div>
          <label className="date-control">
            <CalendarDays size={18} />
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </label>
        </header>

        {activeView === "today" && (
          <TodayView
            progress={progress}
            logs={state.logs.filter((item) => item.date === selectedDate)}
            onDelete={deleteLog}
            onGoLog={() => setActiveView("log")}
          />
        )}
        {activeView === "log" && (
          <LogView foods={state.foods} onAddFood={addFood} onAddSavedFood={addSavedFoodToLog} />
        )}
        {activeView === "history" && <HistoryView targets={state.targets} logs={state.logs} />}
        {activeView === "foods" && (
          <FoodsView foods={state.foods} onAddSavedFood={addSavedFoodToLog} onDeleteFood={deleteFood} />
        )}
        {activeView === "settings" && (
          <SettingsView
            profile={state.profile}
            targets={state.targets}
            onSave={(profile, targets) => updateState({ ...state, profile, targets })}
            onReset={() => {
              updateState(resetState());
              setActiveView("today");
            }}
          />
        )}
      </section>
    </main>
  );
}

function NavButton({
  view,
  activeView,
  onSelect,
  icon,
}: {
  view: View;
  activeView: View;
  onSelect: (view: View) => void;
  icon: React.ReactNode;
}) {
  const label = view[0].toUpperCase() + view.slice(1);

  return (
    <button
      aria-label={label}
      className={`nav-button ${activeView === view ? "active" : ""}`}
      onClick={() => onSelect(view)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Onboarding({
  onComplete,
  onLoadDemo,
}: {
  onComplete: (profile: UserProfile, targets: NutritionTargets) => void;
  onLoadDemo: () => void;
}) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [goalMode, setGoalMode] = useState<GoalMode>("build");
  const [manualTargets, setManualTargets] = useState(() => estimateTargets(defaultProfile, "build"));

  function updateProfile(nextProfile: UserProfile) {
    setProfile(nextProfile);
    setManualTargets(estimateTargets(nextProfile, goalMode));
  }

  function updateGoalMode(nextGoalMode: GoalMode) {
    setGoalMode(nextGoalMode);
    setManualTargets(estimateTargets(profile, nextGoalMode));
  }

  return (
    <section className="onboarding">
      <div className="onboarding-copy">
        <p className="eyebrow">MacroCompass</p>
        <h1>Set the target before the meals start talking.</h1>
        <p>
          Pick the mode, tune the numbers, and v0 opens straight into the daily nutrition surface.
        </p>
        <div className="action-row">
          <button className="secondary-button" onClick={onLoadDemo}>
            <Sparkles size={18} />
            Load demo day
          </button>
        </div>
      </div>

      <form
        className="onboarding-panel"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete(profile, { ...manualTargets, calculationMethod: "manual" });
        }}
      >
        <div>
          <p className="eyebrow">Goal mode</p>
          <div className="segmented">
            {(["build", "shred", "maintain"] as GoalMode[]).map((mode) => (
              <button
                type="button"
                className={goalMode === mode ? "selected" : ""}
                key={mode}
                onClick={() => updateGoalMode(mode)}
              >
                {goalLabels[mode]}
              </button>
            ))}
          </div>
        </div>

        <div className="form-grid">
          <TextInput label="Name" value={profile.displayName} onChange={(value) => updateProfile({ ...profile, displayName: value })} />
          <NumberInput label="Age" value={profile.age} onChange={(value) => updateProfile({ ...profile, age: value })} />
          <NumberInput label="Height (in)" value={profile.heightInches} onChange={(value) => updateProfile({ ...profile, heightInches: value })} />
          <NumberInput label="Weight (lb)" value={profile.weightLbs} onChange={(value) => updateProfile({ ...profile, weightLbs: value })} />
          <NumberInput
            label="Training days"
            value={profile.trainingDaysPerWeek}
            onChange={(value) => updateProfile({ ...profile, trainingDaysPerWeek: value })}
          />
          <label className="field">
            <span>Activity</span>
            <select
              value={profile.activityLevel}
              onChange={(event) => updateProfile({ ...profile, activityLevel: event.target.value as UserProfile["activityLevel"] })}
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very active</option>
            </select>
          </label>
        </div>

        <div className="target-editor">
          <p className="eyebrow">Daily targets</p>
          <div className="macro-inputs">
            <NumberInput label="Calories" value={manualTargets.calories} onChange={(value) => setManualTargets({ ...manualTargets, calories: value })} />
            <NumberInput label="Protein" value={manualTargets.proteinGrams} onChange={(value) => setManualTargets({ ...manualTargets, proteinGrams: value })} />
            <NumberInput label="Carbs" value={manualTargets.carbGrams} onChange={(value) => setManualTargets({ ...manualTargets, carbGrams: value })} />
            <NumberInput label="Fat" value={manualTargets.fatGrams} onChange={(value) => setManualTargets({ ...manualTargets, fatGrams: value })} />
          </div>
        </div>

        <button className="primary-button" type="submit">
          <Save size={18} />
          Start tracking
        </button>
      </form>
    </section>
  );
}

function TodayView({
  progress,
  logs,
  onDelete,
  onGoLog,
}: {
  progress: ReturnType<typeof calculateDailyProgress>;
  logs: MealLogItem[];
  onDelete: (id: string) => void;
  onGoLog: () => void;
}) {
  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">{goalLabels[progress.target.goalMode]} target</p>
          <h3>{round(progress.remaining.calories)} calories remaining</h3>
          <p>{statusLabels[progress.status]} for {progress.date}</p>
          <div className="hero-stats">
            <MetricPill label="Consumed" value={`${round(progress.consumed.calories)} cal`} />
            <MetricPill label="Protein left" value={`${round(progress.remaining.proteinGrams)}g`} />
            <MetricPill label="Target" value={`${progress.target.calories} cal`} />
          </div>
        </div>
        <div className="calorie-ring" style={{ "--progress": `${Math.min(progress.percentComplete.calories * 100, 120)}%` } as React.CSSProperties}>
          <span>{round(progress.consumed.calories)}</span>
          <small>of {progress.target.calories}</small>
        </div>
      </section>

      <section className="macro-grid">
        <MacroBar label="Protein" consumed={progress.consumed.proteinGrams} target={progress.target.proteinGrams} remaining={progress.remaining.proteinGrams} />
        <MacroBar label="Carbs" consumed={progress.consumed.carbGrams} target={progress.target.carbGrams} remaining={progress.remaining.carbGrams} />
        <MacroBar label="Fat" consumed={progress.consumed.fatGrams} target={progress.target.fatGrams} remaining={progress.remaining.fatGrams} />
      </section>

      <section className="insight-grid">
        <TrendDashboard targets={progress.target} />
        <MealSuggestions />
      </section>

      <section className="meal-board">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Meals</p>
            <h3>Logged today</h3>
          </div>
          <button className="secondary-button" onClick={onGoLog}>
            <Plus size={18} />
            Add food
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={28} />
            <p>No meals logged for this date yet.</p>
          </div>
        ) : (
          mealTypes.map((mealType) => (
            <MealGroup
              key={mealType}
              mealType={mealType}
              items={logs.filter((item) => item.mealType === mealType)}
              onDelete={onDelete}
            />
          ))
        )}
      </section>
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TrendDashboard({ targets }: { targets: NutritionTargets }) {
  const data = createTrendData(targets);
  const width = 640;
  const height = 220;
  const padding = 28;
  const maxCalories = Math.max(...data.map((point) => point.calories), targets.calories) * 1.08;
  const minCalories = Math.min(...data.map((point) => point.calories), targets.calories) * 0.9;
  const range = maxCalories - minCalories;
  const linePoints = data
    .map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.calories - minCalories) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const targetY = height - padding - ((targets.calories - minCalories) / range) * (height - padding * 2);
  const averageAdherence = round(data.reduce((total, point) => total + point.adherence, 0) / data.length);
  const averageProtein = round(data.reduce((total, point) => total + point.proteinGrams, 0) / data.length);

  return (
    <div className="trend-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Two-week trajectory</p>
          <h3>Progress trend</h3>
        </div>
        <BarChart3 size={24} />
      </div>
      <div className="trend-metrics">
        <MetricPill label="Adherence" value={`${averageAdherence}%`} />
        <MetricPill label="Avg protein" value={`${averageProtein}g`} />
        <MetricPill label="Daily target" value={`${targets.calories}`} />
      </div>
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Two week calorie progress chart">
        <line className="target-line" x1={padding} x2={width - padding} y1={targetY} y2={targetY} />
        <polyline className="trend-line" points={linePoints} />
        {data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * (width - padding * 2);
          const y = height - padding - ((point.calories - minCalories) / range) * (height - padding * 2);
          const barHeight = Math.max(18, (point.adherence / 100) * 88);

          return (
            <g className="trend-point" key={`${point.day}-${index}`}>
              <rect x={x - 8} y={height - padding - barHeight} width="16" height={barHeight} rx="5" />
              <circle cx={x} cy={y} r="5" />
              <text x={x} y={height - 6}>
                {point.day[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function MealSuggestions() {
  return (
    <div className="suggestion-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Good examples</p>
          <h3>Meal ideas</h3>
        </div>
        <Utensils size={24} />
      </div>
      <div className="suggestion-list">
        {mealSuggestions.map((meal) => (
          <article className="suggestion-card" key={`${meal.mealType}-${meal.title}`}>
            <span>{meal.mealType}</span>
            <strong>{meal.title}</strong>
            <p>{meal.detail}</p>
            <small>{meal.macros}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function MacroBar({
  label,
  consumed,
  target,
  remaining,
}: {
  label: string;
  consumed: number;
  target: number;
  remaining: number;
}) {
  const percent = target > 0 ? Math.min((consumed / target) * 100, 120) : 0;

  return (
    <div className="macro-card">
      <div>
        <span>{label}</span>
        <strong>{round(remaining)}g left</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${percent}%` }} />
      </div>
      <small>
        {round(consumed)}g / {round(target)}g
      </small>
    </div>
  );
}

function MealGroup({
  mealType,
  items,
  onDelete,
}: {
  mealType: MealType;
  items: MealLogItem[];
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="meal-group">
      <h4>{mealType}</h4>
      {items.map((item) => (
        <div className="meal-row" key={item.id}>
          <div>
            <strong>{item.name}</strong>
            <span>
              {item.calories} cal · {item.proteinGrams}p · {item.carbGrams}c · {item.fatGrams}f
            </span>
          </div>
          <button className="icon-button" aria-label={`Delete ${item.name}`} onClick={() => onDelete(item.id)}>
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}

function LogView({
  foods,
  onAddFood,
  onAddSavedFood,
}: {
  foods: Food[];
  onAddFood: (values: FoodFormValues) => string | null;
  onAddSavedFood: (food: Food, mealType: MealType) => void;
}) {
  const [values, setValues] = useState(defaultFoodForm);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="two-column-view">
      <form
        className="tool-panel"
        onSubmit={(event) => {
          event.preventDefault();
          const result = onAddFood(values);
          setMessage(result ?? `${values.name} added.`);
          if (!result) {
            setValues(defaultFoodForm);
          }
        }}
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Manual log</p>
            <h3>Add food</h3>
          </div>
          <Flame size={24} />
        </div>
        <TextInput label="Food" value={values.name} onChange={(value) => setValues({ ...values, name: value })} />
        <div className="form-grid">
          <label className="field">
            <span>Meal</span>
            <select value={values.mealType} onChange={(event) => setValues({ ...values, mealType: event.target.value as MealType })}>
              {mealTypes.map((mealType) => (
                <option key={mealType} value={mealType}>
                  {mealType}
                </option>
              ))}
            </select>
          </label>
          <TextInput label="Serving" value={values.servingLabel} onChange={(value) => setValues({ ...values, servingLabel: value })} />
          <NumberInput label="Quantity" value={values.quantity} onChange={(value) => setValues({ ...values, quantity: value })} />
          <NumberInput label="Calories" value={values.calories} onChange={(value) => setValues({ ...values, calories: value })} />
          <NumberInput label="Protein" value={values.proteinGrams} onChange={(value) => setValues({ ...values, proteinGrams: value })} />
          <NumberInput label="Carbs" value={values.carbGrams} onChange={(value) => setValues({ ...values, carbGrams: value })} />
          <NumberInput label="Fat" value={values.fatGrams} onChange={(value) => setValues({ ...values, fatGrams: value })} />
        </div>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={values.saveToFoods}
            onChange={(event) => setValues({ ...values, saveToFoods: event.target.checked })}
          />
          Save to foods
        </label>
        <button className="primary-button" type="submit">
          <Plus size={18} />
          Add to day
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>

      <SavedFoodQuickAdd foods={foods} onAddSavedFood={onAddSavedFood} />
    </div>
  );
}

function SavedFoodQuickAdd({
  foods,
  onAddSavedFood,
}: {
  foods: Food[];
  onAddSavedFood: (food: Food, mealType: MealType) => void;
}) {
  const [mealType, setMealType] = useState<MealType>("snack");

  return (
    <section className="tool-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Saved</p>
          <h3>Quick add</h3>
        </div>
        <select value={mealType} onChange={(event) => setMealType(event.target.value as MealType)}>
          {mealTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="food-list">
        {foods.map((food) => (
          <button className="food-button" key={food.id} onClick={() => onAddSavedFood(food, mealType)}>
            <strong>{food.name}</strong>
            <span>{food.calories} cal · {food.proteinGrams}p</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function HistoryView({ targets, logs }: { targets: NutritionTargets; logs: MealLogItem[] }) {
  const dates = Array.from(new Set([isoToday(), ...logs.map((item) => item.date)])).sort().reverse().slice(0, 14);

  return (
    <section className="view-stack">
      <TrendDashboard targets={targets} />
      <div className="history-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Logged days</p>
            <h3>History</h3>
          </div>
          <History size={24} />
        </div>
        {dates.map((date) => {
          const progress = calculateDailyProgress(date, targets, logs);
          return (
            <div className="history-row" key={date}>
              <div>
                <strong>{date}</strong>
                <span>{statusLabels[progress.status]}</span>
              </div>
              <div>
                <strong>{round(progress.consumed.calories)}</strong>
                <span>of {targets.calories} cal</span>
              </div>
              <div>
                <strong>{round(progress.consumed.proteinGrams)}g</strong>
                <span>protein</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FoodsView({
  foods,
  onAddSavedFood,
  onDeleteFood,
}: {
  foods: Food[];
  onAddSavedFood: (food: Food, mealType: MealType) => void;
  onDeleteFood: (id: string) => void;
}) {
  const [mealType, setMealType] = useState<MealType>("snack");

  return (
    <section className="view-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Reusable foods</p>
          <h3>Saved foods</h3>
        </div>
        <select value={mealType} onChange={(event) => setMealType(event.target.value as MealType)}>
          {mealTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="food-table">
        {foods.length === 0 ? (
          <div className="empty-state">
            <Utensils size={28} />
            <p>Saved foods appear here after logging with save enabled.</p>
          </div>
        ) : (
          foods.map((food) => (
            <div className="food-row" key={food.id}>
              <div>
                <strong>{food.name}</strong>
                <span>{food.servingLabel}</span>
              </div>
              <span>{food.calories} cal</span>
              <span>{food.proteinGrams}p / {food.carbGrams}c / {food.fatGrams}f</span>
              <button className="icon-button" aria-label={`Add ${food.name}`} onClick={() => onAddSavedFood(food, mealType)}>
                <Plus size={18} />
              </button>
              <button className="icon-button" aria-label={`Delete ${food.name}`} onClick={() => onDeleteFood(food.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function SettingsView({
  profile,
  targets,
  onSave,
  onReset,
}: {
  profile: UserProfile;
  targets: NutritionTargets;
  onSave: (profile: UserProfile, targets: NutritionTargets) => void;
  onReset: () => void;
}) {
  const [draftProfile, setDraftProfile] = useState(profile);
  const [draftTargets, setDraftTargets] = useState(targets);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="two-column-view"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(draftProfile, { ...draftTargets, calculationMethod: "manual" });
        setMessage("Settings saved.");
      }}
    >
      <section className="tool-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Profile</p>
            <h3>Assumptions</h3>
          </div>
          <Dumbbell size={24} />
        </div>
        <div className="form-grid">
          <TextInput label="Name" value={draftProfile.displayName} onChange={(value) => setDraftProfile({ ...draftProfile, displayName: value })} />
          <NumberInput label="Age" value={draftProfile.age} onChange={(value) => setDraftProfile({ ...draftProfile, age: value })} />
          <NumberInput label="Height (in)" value={draftProfile.heightInches} onChange={(value) => setDraftProfile({ ...draftProfile, heightInches: value })} />
          <NumberInput label="Weight (lb)" value={draftProfile.weightLbs} onChange={(value) => setDraftProfile({ ...draftProfile, weightLbs: value })} />
        </div>
      </section>

      <section className="tool-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Targets</p>
            <h3>Daily numbers</h3>
          </div>
          <Target size={24} />
        </div>
        <div className="segmented">
          {(["build", "shred", "maintain"] as GoalMode[]).map((mode) => (
            <button
              type="button"
              className={draftTargets.goalMode === mode ? "selected" : ""}
              key={mode}
              onClick={() => setDraftTargets({ ...estimateTargets(draftProfile, mode), calculationMethod: "manual" })}
            >
              {goalLabels[mode]}
            </button>
          ))}
        </div>
        <div className="macro-inputs">
          <NumberInput label="Calories" value={draftTargets.calories} onChange={(value) => setDraftTargets({ ...draftTargets, calories: value })} />
          <NumberInput label="Protein" value={draftTargets.proteinGrams} onChange={(value) => setDraftTargets({ ...draftTargets, proteinGrams: value })} />
          <NumberInput label="Carbs" value={draftTargets.carbGrams} onChange={(value) => setDraftTargets({ ...draftTargets, carbGrams: value })} />
          <NumberInput label="Fat" value={draftTargets.fatGrams} onChange={(value) => setDraftTargets({ ...draftTargets, fatGrams: value })} />
        </div>
        <div className="action-row">
          <button className="primary-button" type="submit">
            <Save size={18} />
            Save
          </button>
          <button className="secondary-button danger" type="button" onClick={onReset}>
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
        {message && <p className="form-message">{message}</p>}
      </section>
    </form>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        min="0"
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default App;
