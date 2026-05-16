import type { OnboardingState } from '$lib/types/planV2';

export type IntakeErrors = Partial<Record<string, string>>;

/** Error keys `validateIntakeStep` may set for a given step (for clearing UI errors). */
export function intakeErrorKeysForStep(step: OnboardingState['step']): readonly string[] {
	switch (step) {
		case 1:
			return ['profile.name', 'profile.age', 'profile.sex', 'profile.height', 'profile.weight'];
		case 2:
			return ['goal.primary_goal', 'goal.timeline_weeks', 'goal.urgency'];
		case 3:
			return ['training.days_per_week', 'training.location', 'training.fitness_level'];
		case 4:
			return ['diet.preference', 'diet.meals_per_day', 'diet.cooking_time', 'diet.meal_prep'];
		case 5:
			return ['supplements.budget'];
		case 6:
			return ['lifestyle.country', 'lifestyle.activity_outside_gym', 'lifestyle.stress_level'];
		default:
			return [];
	}
}

function ageOk(age: string): boolean {
	const n = parseInt(age, 10);
	return Number.isFinite(n) && n >= 16 && n <= 80;
}

function heightOk(o: OnboardingState['profile']): boolean {
	if (o.height_unit === 'ftin') {
		const ft = parseInt(o.height_ft, 10);
		const inch = parseInt(o.height_in, 10);
		return (
			Number.isFinite(ft) && ft >= 3 && ft <= 8 && Number.isFinite(inch) && inch >= 0 && inch <= 11
		);
	}
	const cm = parseFloat(o.height_cm);
	return Number.isFinite(cm) && cm >= 120 && cm <= 250;
}

function weightOk(o: OnboardingState['profile']): boolean {
	if (o.weight_unit === 'lbs') {
		const w = parseFloat(o.weight_lbs);
		return Number.isFinite(w) && w >= 50 && w <= 500;
	}
	const w = parseFloat(o.weight_kg);
	return Number.isFinite(w) && w >= 25 && w <= 300;
}

function daysOk(s: string): boolean {
	const n = parseInt(s, 10);
	return Number.isFinite(n) && n >= 1 && n <= 7;
}

/** Validate the current intake step before advancing. */
export function validateIntakeStep(
	step: OnboardingState['step'],
	o: OnboardingState
): { ok: boolean; errors: IntakeErrors } {
	const errors: IntakeErrors = {};

	if (step === 1) {
		if (!o.profile.name.trim()) errors['profile.name'] = 'Enter your name.';
		if (!ageOk(o.profile.age)) errors['profile.age'] = 'Age must be between 16 and 80.';
		if (!o.profile.sex.trim()) errors['profile.sex'] = 'Select sex.';
		if (!heightOk(o.profile)) errors['profile.height'] = 'Enter a valid height.';
		if (!weightOk(o.profile)) errors['profile.weight'] = 'Enter a valid weight.';
	} else if (step === 2) {
		if (!o.goal.primary_goal) errors['goal.primary_goal'] = 'Choose a primary goal.';
		if (!o.goal.timeline_weeks) errors['goal.timeline_weeks'] = 'Choose a program length.';
		if (!o.goal.urgency) errors['goal.urgency'] = 'Choose a pace.';
	} else if (step === 3) {
		if (!daysOk(o.training.days_per_week))
			errors['training.days_per_week'] = 'Training days must be 1–7.';
		if (!o.training.location.trim()) errors['training.location'] = 'Select where you train.';
		if (!o.training.fitness_level.trim())
			errors['training.fitness_level'] = 'Select fitness level.';
	} else if (step === 4) {
		if (!o.diet.preference.trim()) errors['diet.preference'] = 'Select a dietary pattern.';
		if (!o.diet.meals_per_day.trim()) errors['diet.meals_per_day'] = 'Select meals per day.';
		if (!o.diet.cooking_time.trim()) errors['diet.cooking_time'] = 'Select typical cooking time.';
		if (!o.diet.meal_prep.trim()) errors['diet.meal_prep'] = 'Select meal prep preference.';
	} else if (step === 5) {
		if (!o.supplements.budget.trim()) errors['supplements.budget'] = 'Select a supplement budget.';
	} else if (step === 6) {
		if (!o.lifestyle.country.trim())
			errors['lifestyle.country'] = 'Enter your country (for groceries).';
		if (!o.lifestyle.activity_outside_gym.trim())
			errors['lifestyle.activity_outside_gym'] = 'Select daily activity outside the gym.';
		if (!o.lifestyle.stress_level.trim()) errors['lifestyle.stress_level'] = 'Select stress level.';
	}

	return { ok: Object.keys(errors).length === 0, errors };
}

/** Full intake validation before leaving for Import. */
export function validateIntakeComplete(o: OnboardingState): { ok: boolean; errors: IntakeErrors } {
	const errors: IntakeErrors = {};
	for (let s = 1; s <= 6; s++) {
		const { errors: e } = validateIntakeStep(s as OnboardingState['step'], o);
		Object.assign(errors, e);
	}
	return { ok: Object.keys(errors).length === 0, errors };
}
