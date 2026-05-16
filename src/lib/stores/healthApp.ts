import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import {
	LS_ACTIVE_DAY_TYPE,
	LS_GROCERY,
	LS_ONBOARDING,
	LS_PLAN,
	LS_PROGRESS,
	LS_SETTINGS
} from '$lib/constants/storage';
import { defaultOnboardingState, normalizeOnboarding } from '$lib/logic/onboardingState';
import type { DayType, OnboardingState, PlanV2, ProgressV2 } from '$lib/types/planV2';
import { parsePlanJsonText } from '$lib/validation/planV2';

export const plan = writable<PlanV2 | null>(null);
export const importWarnings = writable<string[]>([]);
export const activeDayType = writable<DayType>('workout');
export const progress = writable<ProgressV2>({});
export const settings = writable<Record<string, unknown>>({});

export const onboarding = writable<OnboardingState>(defaultOnboardingState());

function readJson<T>(key: string, fallback: T): T {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

function writeJson(key: string, value: unknown) {
	if (!browser) return;
	localStorage.setItem(key, JSON.stringify(value));
}

/** Hydrate all persisted slices (call once from root layout onMount). */
export function hydrateFromLocalStorage() {
	if (!browser) return;

	const rawPlan = localStorage.getItem(LS_PLAN);
	if (rawPlan) {
		const r = parsePlanJsonText(rawPlan);
		if (r.ok) {
			plan.set(r.plan);
			importWarnings.set(r.warnings);
		} else {
			plan.set(null);
			importWarnings.set([r.error]);
		}
	} else {
		plan.set(null);
	}

	const dt = localStorage.getItem(LS_ACTIVE_DAY_TYPE);
	if (dt === 'workout' || dt === 'rest') activeDayType.set(dt);
	else activeDayType.set('workout');

	progress.set(readJson<ProgressV2>(LS_PROGRESS, {}));
	settings.set(readJson<Record<string, unknown>>(LS_SETTINGS, {}));
	let obRaw: unknown = null;
	try {
		const s = localStorage.getItem(LS_ONBOARDING);
		if (s) obRaw = JSON.parse(s);
	} catch {
		obRaw = null;
	}
	onboarding.set(normalizeOnboarding(obRaw));
}

export function persistOnboarding(state: OnboardingState) {
	writeJson(LS_ONBOARDING, state);
	onboarding.set(state);
}

export function persistActiveDayType(dt: DayType) {
	localStorage.setItem(LS_ACTIVE_DAY_TYPE, dt);
	activeDayType.set(dt);
}

export function persistProgress(p: ProgressV2) {
	writeJson(LS_PROGRESS, p);
	progress.set(p);
}

export function persistSettings(s: Record<string, unknown>) {
	writeJson(LS_SETTINGS, s);
	settings.set(s);
}

export function savePlan(p: PlanV2, warnings: string[]) {
	writeJson(LS_PLAN, p);
	plan.set(p);
	importWarnings.set(warnings);
}

export function clearAllLocalHealthData() {
	if (!browser) return;
	for (const k of [
		LS_PLAN,
		LS_PROGRESS,
		LS_GROCERY,
		LS_SETTINGS,
		LS_ACTIVE_DAY_TYPE,
		LS_ONBOARDING
	]) {
		localStorage.removeItem(k);
	}
	plan.set(null);
	importWarnings.set([]);
	activeDayType.set('workout');
	progress.set({});
	settings.set({});
	onboarding.set(defaultOnboardingState());
}

export function getPlan(): PlanV2 | null {
	return get(plan);
}
