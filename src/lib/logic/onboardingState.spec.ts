import { describe, expect, it } from 'vitest';
import { defaultOnboardingState, normalizeOnboarding } from './onboardingState';

describe('normalizeOnboarding', () => {
	it('returns defaults for non-object input', () => {
		const o = normalizeOnboarding(null);
		expect(o.step).toBe(1);
		expect(o.profile.name).toBe('');
		expect(o.goal.primary_goal).toBe('');
	});

	it('merges new six-step shape', () => {
		const base = defaultOnboardingState();
		const raw = {
			...base,
			step: 3,
			goal: { ...base.goal, primary_goal: 'fat_loss' as const },
			training: { ...base.training, days_per_week: '5' }
		};
		const o = normalizeOnboarding(raw);
		expect(o.step).toBe(3);
		expect(o.goal.primary_goal).toBe('fat_loss');
		expect(o.training.days_per_week).toBe('5');
	});

	it('migrates legacy four-step localStorage shape', () => {
		const raw = {
			step: 4,
			confirmed: true,
			profile: {
				name: 'Sam',
				age: '40',
				sex: 'male',
				height_cm: '180',
				weight_kg: '88',
				goal: 'muscle_gain'
			},
			lifestyle: {
				wake_time: '06:30',
				sleep_time: '22:30',
				training_time: '17:00',
				activity_level: 'moderate'
			}
		};
		const o = normalizeOnboarding(raw);
		expect(o.profile.name).toBe('Sam');
		expect(o.goal.primary_goal).toBe('muscle_gain');
		expect(o.lifestyle.wake_time).toBe('06:30');
		expect(o.lifestyle.activity_outside_gym).toBe('light');
		expect(o.step).toBe(1);
	});
});
