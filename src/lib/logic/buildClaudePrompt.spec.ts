import { describe, expect, it } from 'vitest';
import { buildClaudePrompt, profilePayloadFromOnboarding } from './buildClaudePrompt';
import type { OnboardingState } from '$lib/types/planV2';

function sampleOnboarding(over?: Partial<OnboardingState>): OnboardingState {
	return {
		step: over?.step ?? 4,
		confirmed: over?.confirmed ?? true,
		profile: {
			name: 'Alex',
			age: '32',
			sex: 'female',
			height_cm: '165',
			weight_kg: '62',
			goal: 'recomp',
			...over?.profile
		},
		lifestyle: {
			wake_time: '07:00',
			sleep_time: '23:00',
			training_time: '18:30',
			activity_level: 'moderate',
			...over?.lifestyle
		}
	};
}

describe('buildClaudePrompt', () => {
	it('injects profile JSON and schema tail', () => {
		const text = buildClaudePrompt(sampleOnboarding());
		expect(text).toContain("=== PERSON'S PROFILE ===");
		expect(text).toContain('"name": "Alex"');
		expect(text).toContain('"wake_time_clock": "07:00"');
		expect(text).toContain('SCHEMA VERSION 2');
		expect(text).toContain('training.weekly_split');
	});

	it('profilePayload uses defaults for empty fields', () => {
		const p = profilePayloadFromOnboarding(
			sampleOnboarding({
				profile: {
					name: '',
					age: '',
					sex: '',
					height_cm: '',
					weight_kg: '',
					goal: ''
				},
				lifestyle: {
					wake_time: '',
					sleep_time: '',
					training_time: '',
					activity_level: ''
				}
			})
		);
		expect(p.name).toBe('not provided');
		expect(p.wake_time_clock).toBe('not specified');
	});
});
