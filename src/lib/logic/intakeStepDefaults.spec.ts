import { describe, expect, it } from 'vitest';
import { defaultOnboardingState } from './onboardingState';
import { applyIntakeStepDefaults } from './intakeStepDefaults';
import { validateIntakeComplete, validateIntakeStep } from './onboardingValidation';

describe('applyIntakeStepDefaults', () => {
	it('fills step 1 without overwriting a valid name', () => {
		const o = defaultOnboardingState();
		o.profile.name = 'Alex';
		const next = applyIntakeStepDefaults(1, o);
		expect(next.profile.name).toBe('Alex');
		expect(validateIntakeStep(1, next).ok).toBe(true);
	});

	it('makes each step pass validation from an empty state', () => {
		let o = defaultOnboardingState();
		for (let s = 1; s <= 6; s++) {
			o = applyIntakeStepDefaults(s as 1 | 2 | 3 | 4 | 5 | 6, o);
			expect(validateIntakeStep(s as 1 | 2 | 3 | 4 | 5 | 6, o).ok).toBe(true);
		}
		expect(validateIntakeComplete(o).ok).toBe(true);
	});

	it('fixes only invalid training days', () => {
		const o = defaultOnboardingState();
		o.profile.name = 'A';
		o.profile.age = '30';
		o.profile.sex = 'female';
		o.profile.height_cm = '170';
		o.profile.weight_kg = '70';
		o.goal.primary_goal = 'fat_loss';
		o.goal.timeline_weeks = '12';
		o.goal.urgency = 'sustainable';
		o.training.days_per_week = '99';
		o.training.location = 'full_gym';
		o.training.fitness_level = 'beginner';
		const next = applyIntakeStepDefaults(3, o);
		expect(next.training.days_per_week).toBe('4');
		expect(next.training.location).toBe('full_gym');
		expect(validateIntakeStep(3, next).ok).toBe(true);
	});
});
