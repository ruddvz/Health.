import type { OnboardingState } from '$lib/types/planV2';
import promptTemplate from './claudePromptTemplate.txt?raw';

const SCHEMA_V2_TAIL = `

=== SCHEMA VERSION 2 (recommended) ===
- Set meta.plan_schema_version to 2.
- Include one consistent schedule (wake, sleep, training, meal_times).
- Align meal_plan.daily_totals with phase calories within ±100 kcal and protein within ±10 g.
- Include training.weekly_split with exercises (sets, reps, rest_seconds, substitutions, progression, form_cues).
- Supplements: cautious wording only ("may help", "evidence mixed", "check label", "consult clinician if on medication").
- Respect allergies_intolerances and medication_or_condition_flag from the profile when choosing foods and supplements.
`;

/** Maps compact onboarding state to the same profile shape the legacy app sent to Claude. */
export function profilePayloadFromOnboarding(o: OnboardingState): Record<string, string | number> {
	const { profile, lifestyle } = o;
	const height = profile.height_cm.trim() ? `${profile.height_cm.trim()} cm` : 'not provided';
	const weight = profile.weight_kg.trim() ? `${profile.weight_kg.trim()} kg` : 'not provided';
	const activityMap: Record<string, string> = {
		low: 'low — mostly sedentary outside training',
		moderate: 'moderate — light daily movement',
		high: 'high — active day-to-day life',
		'': 'not specified'
	};
	return {
		name: profile.name.trim() || 'not provided',
		age: profile.age.trim() || 'not provided',
		sex: profile.sex.trim() || 'not provided',
		weight,
		height,
		body_fat_pct: 'not provided',
		goal: profile.goal.trim() || 'not specified',
		timeline: '12 weeks (default — adjust in JSON if user specified elsewhere)',
		target_weight: 'not specified',
		urgency: 'balanced (default — app intake is abbreviated)',
		training_days_per_week: 4,
		training_location: 'not specified — ask user to edit plan JSON if needed',
		fitness_level: 'not specified',
		injuries: 'none',
		dietary_preference: 'not specified in app intake',
		food_dislikes: 'none',
		allergies_intolerances: 'none',
		medication_or_condition_flag: 'not indicated',
		meals_per_day: 'not specified',
		cooking_time: 'not specified',
		meal_prep: 'not specified',
		cooking_equipment: 'not specified',
		supplements_owned: 'not specified',
		supplement_budget: 'not specified',
		other_supplements: 'none',
		country: 'not specified',
		city: 'not provided',
		activity_outside_gym: activityMap[lifestyle.activity_level] ?? 'not specified',
		sleep_hours: 'not specified',
		stress_level: 'not specified',
		biggest_challenges: 'not specified',
		wake_time_clock: lifestyle.wake_time.trim() || 'not specified',
		sleep_time_clock: lifestyle.sleep_time.trim() || 'not specified',
		training_time_clock: lifestyle.training_time.trim() || 'not specified',
		intake_source:
			'Health PWA SvelteKit — partial profile; defaults used for fields not collected in-app'
	};
}

export function buildClaudePrompt(o: OnboardingState): string {
	const profileJSON = JSON.stringify(profilePayloadFromOnboarding(o), null, 2);
	return promptTemplate.replace('{FORM_DATA_JSON}', profileJSON) + SCHEMA_V2_TAIL;
}

export type CopyPromptResult = 'clipboard' | 'execCommand' | 'failed';

/** Clipboard API when available; falls back to execCommand for some browsers / contexts. */
export async function copyTextToClipboard(text: string): Promise<CopyPromptResult> {
	if (typeof window === 'undefined') return 'failed';
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return 'clipboard';
		}
	} catch {
		// continue to fallback
	}
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'fixed';
		ta.style.left = '-9999px';
		ta.style.top = '0';
		document.body.appendChild(ta);
		ta.focus();
		ta.select();
		const ok = document.execCommand('copy');
		document.body.removeChild(ta);
		return ok ? 'execCommand' : 'failed';
	} catch {
		return 'failed';
	}
}
