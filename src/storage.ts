import type { AppState } from "./types";

const storageKey = "macrocompass:v0";

export const emptyState: AppState = {
  onboardingComplete: false,
  foods: [],
  logs: [],
};

export function loadState(): AppState {
  const stored = localStorage.getItem(storageKey);

  if (!stored) {
    return emptyState;
  }

  try {
    return { ...emptyState, ...JSON.parse(stored) } as AppState;
  } catch {
    return emptyState;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export function resetState(): AppState {
  localStorage.removeItem(storageKey);
  return emptyState;
}

