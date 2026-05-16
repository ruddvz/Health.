import { describe, expect, it } from 'vitest';
import { defaultOnboardingState } from './onboardingState';
import { validateIntakeComplete, validateIntakeStep } from './onboardingValidation';

describe('onboardingValidation', () => {
	it('requires profile basics on step 1', () => {
		const o = defaultOnboardingState();
		const r = validateIntakeStep(1, o);
		expect(r.ok).toBe(false);
		expect(r.errors['profile.name']).toBeDefined();
	});

	it('passes step 1 with minimal valid profile', () => {
		const o = defaultOnboardingState();
		o.profile.name = 'A';
		o.profile.age = '30';
		o.profile.sex = 'female';
		o.profile.height_cm = '170';
		o.profile.weight_kg = '70';
		expect(validateIntakeStep(1, o).ok).toBe(true);
	});

	it('requires goal fields on step 2', () => {
		const o = defaultOnboardingState();
		fillProfile(o);
		expect(validateIntakeStep(2, o).ok).toBe(false);
		o.goal.primary_goal = 'recomp';
		o.goal.timeline_weeks = '12';
		o.goal.urgency = 'balanced';
		expect(validateIntakeStep(2, o).ok).toBe(true);
	});

	it('validateIntakeComplete aggregates all steps', () => {
		expect(validateIntakeComplete(defaultOnboardingState()).ok).toBe(false);
	});
});

function fillProfile(o: ReturnType<typeof defaultOnboardingState>) {
	o.profile.name = 'A';
	o.profile.age = '30';
	o.profile.sex = 'female';
	o.profile.height_cm = '170';
	o.profile.weight_kg = '70';
}
