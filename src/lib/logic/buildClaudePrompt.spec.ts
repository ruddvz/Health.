import { describe, expect, it } from 'vitest';
import {
	buildClaudePrompt,
	profilePayloadFromOnboarding,
	sexForClaudeProfile
} from './buildClaudePrompt';
import { defaultOnboardingState } from './onboardingState';
import type { OnboardingState } from '$lib/types/planV2';

function fullSample(): OnboardingState {
	const d = defaultOnboardingState();
	return {
		...d,
		step: 6,
		confirmed: true,
		profile: {
			...d.profile,
			name: 'Alex',
			age: '32',
			sex: 'female',
			height_unit: 'cm',
			height_cm: '165',
			weight_unit: 'kg',
			weight_kg: '62',
			body_fat_pct: '22'
		},
		goal: {
			...d.goal,
			primary_goal: 'recomp',
			timeline_weeks: '12',
			target_weight: '58',
			urgency: 'balanced'
		},
		training: {
			...d.training,
			days_per_week: '4',
			location: 'full_gym',
			fitness_level: 'intermediate',
			injuries: 'none'
		},
		diet: {
			...d.diet,
			preference: 'omnivore',
			allergies: 'shellfish',
			medication_warning: true,
			meals_per_day: '4',
			cooking_time: 'under_20',
			meal_prep: 'yes',
			equipment: 'Instant Pot'
		},
		supplements: {
			...d.supplements,
			owned: 'creatine',
			budget: 'budget_2040',
			other: ''
		},
		lifestyle: {
			...d.lifestyle,
			country: 'Canada',
			city: 'Toronto',
			wake_time: '07:00',
			sleep_time: '23:00',
			training_time: '18:00',
			activity_outside_gym: 'sedentary',
			sleep_hours: '7',
			stress_level: 'moderate',
			biggest_challenges: 'Late-night snacking'
		}
	};
}

describe('buildClaudePrompt', () => {
	it('injects profile JSON and schema tail', () => {
		const text = buildClaudePrompt(fullSample());
		expect(text).toContain("=== PERSON'S PROFILE ===");
		expect(text).toContain('"name": "Alex"');
		expect(text).toContain('shellfish');
		expect(text).toContain('SCHEMA VERSION 2');
	});

	it('profilePayload reflects medication flag', () => {
		const p = profilePayloadFromOnboarding(fullSample());
		expect(p.medication_or_condition_flag).toContain('yes');
		expect(p.training_days_per_week).toBe(4);
	});

	it('sexForClaudeProfile explains non-binary choice', () => {
		expect(sexForClaudeProfile('female')).toBe('female');
		expect(sexForClaudeProfile('other')).toContain('other');
	});
});
