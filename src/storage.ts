import type { AppState } from "./types";

const storageKey = "macronaut:v0";
const legacyStorageKey = "macrocompass:v0";

export const emptyState: AppState = {
  onboardingComplete: false,
  foods: [],
  logs: [],
};

export function loadState(): AppState {
  const stored = localStorage.getItem(storageKey);
  const legacyStored = localStorage.getItem(legacyStorageKey);

  if (!stored && !legacyStored) {
    return emptyState;
  }

  try {
    const parsedState = stored ? ({ ...emptyState, ...JSON.parse(stored) } as AppState) : emptyState;
    const legacyState = legacyStored ? ({ ...emptyState, ...JSON.parse(legacyStored) } as AppState) : undefined;
    const shouldUseLegacy = legacyState?.onboardingComplete && !parsedState.onboardingComplete;
    const activeState = shouldUseLegacy ? legacyState : parsedState;

    if (shouldUseLegacy || (!stored && legacyState)) {
      saveState(activeState);
    }

    return activeState;
  } catch {
    return emptyState;
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

export function resetState(): AppState {
  localStorage.removeItem(storageKey);
  localStorage.removeItem(legacyStorageKey);
  return emptyState;
}
