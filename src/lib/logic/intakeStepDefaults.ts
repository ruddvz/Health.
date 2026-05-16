import type { OnboardingState } from '$lib/types/planV2';
import { validateIntakeStep } from './onboardingValidation';

function copyState(o: OnboardingState): OnboardingState {
	return structuredClone(o);
}

/** Apply built-in example values only for fields that fail `validateIntakeStep` for this step. */
function applyPatchForErrorKey(next: OnboardingState, key: string): void {
	switch (key) {
		case 'profile.name':
			if (!next.profile.name.trim()) next.profile.name = 'Guest';
			break;
		case 'profile.age':
			next.profile.age = '30';
			break;
		case 'profile.sex':
			next.profile.sex = 'other';
			break;
		case 'profile.height':
			next.profile.height_unit = 'cm';
			next.profile.height_cm = '175';
			next.profile.height_ft = '';
			next.profile.height_in = '';
			break;
		case 'profile.weight':
			next.profile.weight_unit = 'kg';
			next.profile.weight_kg = '75';
			next.profile.weight_lbs = '';
			break;
		case 'goal.primary_goal':
			next.goal.primary_goal = 'maintenance';
			break;
		case 'goal.timeline_weeks':
			next.goal.timeline_weeks = '12';
			break;
		case 'goal.urgency':
			next.goal.urgency = 'balanced';
			break;
		case 'training.days_per_week':
			next.training.days_per_week = '4';
			break;
		case 'training.location':
			next.training.location = 'full_gym';
			break;
		case 'training.fitness_level':
			next.training.fitness_level = 'intermediate';
			break;
		case 'diet.preference':
			next.diet.preference = 'omnivore';
			break;
		case 'diet.meals_per_day':
			next.diet.meals_per_day = '3';
			break;
		case 'diet.cooking_time':
			next.diet.cooking_time = '30_45';
			break;
		case 'diet.meal_prep':
			next.diet.meal_prep = 'no';
			break;
		case 'supplements.budget':
			next.supplements.budget = 'have';
			break;
		case 'lifestyle.country':
			next.lifestyle.country = 'Other';
			break;
		case 'lifestyle.activity_outside_gym':
			next.lifestyle.activity_outside_gym = 'light';
			break;
		case 'lifestyle.stress_level':
			next.lifestyle.stress_level = 'moderate';
			break;
		default:
			break;
	}
}

/**
 * Fill only fields that are empty or invalid for the current step so validation passes.
 * Existing valid answers are left unchanged.
 */
export function applyIntakeStepDefaults(
	step: OnboardingState['step'],
	o: OnboardingState
): OnboardingState {
	const next = copyState(o);
	for (let i = 0; i < 12; i++) {
		const { ok, errors } = validateIntakeStep(step, next);
		if (ok) return next;
		const keys = Object.keys(errors);
		if (keys.length === 0) return next;
		for (const k of keys) applyPatchForErrorKey(next, k);
	}
	return next;
}
