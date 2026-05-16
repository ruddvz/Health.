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

const COOKING_TIME_LABEL: Record<string, string> = {
	under_20: 'Usually under 20 minutes',
	'30_45': '30–45 minutes typical',
	enjoy: 'Enjoys longer / more elaborate cooking',
	'': 'not specified'
};

const MEAL_PREP_LABEL: Record<string, string> = {
	yes: 'Yes — batch cooks',
	no: 'No — cooks day-of',
	'': 'not specified'
};

const SUPP_BUDGET_LABEL: Record<string, string> = {
	have: 'I have what I need',
	budget_2040: 'Budget roughly $20–40/mo',
	mid_4080: 'Mid-range roughly $40–80/mo',
	no_limit: 'No strict supplement budget',
	'': 'not specified'
};

const ACTIVITY_OUTSIDE_LABEL: Record<string, string> = {
	sedentary: 'Mostly sedentary (desk job)',
	light: 'Light daily movement',
	active_job: 'Active job / on feet often',
	very_active_job: 'Very active outside the gym',
	'': 'not specified'
};

function heightDisplay(o: OnboardingState['profile']): string {
	if (o.height_unit === 'ftin') {
		const ft = o.height_ft.trim();
		const inch = o.height_in.trim();
		if (!ft && !inch) return 'not provided';
		return `${ft || '0'} ft ${inch || '0'} in`;
	}
	return o.height_cm.trim() ? `${o.height_cm.trim()} cm` : 'not provided';
}

function weightDisplay(o: OnboardingState['profile']): string {
	if (o.weight_unit === 'lbs') {
		return o.weight_lbs.trim() ? `${o.weight_lbs.trim()} lbs` : 'not provided';
	}
	return o.weight_kg.trim() ? `${o.weight_kg.trim()} kg` : 'not provided';
}

function trainingDays(o: OnboardingState['training']): number {
	const n = parseInt(o.days_per_week, 10);
	if (!Number.isFinite(n)) return 4;
	return Math.min(7, Math.max(1, n));
}

/** Maps onboarding state to the same profile shape the legacy app sent to Claude. */
export function profilePayloadFromOnboarding(o: OnboardingState): Record<string, string | number> {
	const { profile, goal, training, diet, supplements, lifestyle } = o;

	const goalKey = goal.primary_goal.trim() || 'not specified';
	const goalLine = goal.notes.trim() ? `${goalKey} (notes: ${goal.notes.trim()})` : goalKey;

	const targetWt = goal.target_weight.trim();
	const twUnit = profile.weight_unit === 'lbs' ? 'lbs' : 'kg';
	const target_weight = targetWt === '' ? 'not specified' : `${targetWt} ${twUnit}`;

	const medication_or_condition_flag = diet.medication_warning
		? 'yes — review supplements with clinician'
		: 'not indicated';

	return {
		name: profile.name.trim() || 'not provided',
		age: profile.age.trim() || 'not provided',
		sex: profile.sex.trim() || 'not provided',
		weight: weightDisplay(profile),
		height: heightDisplay(profile),
		body_fat_pct: profile.body_fat_pct.trim() || 'not provided',
		goal: goalLine,
		timeline: goal.timeline_weeks.trim() ? `${goal.timeline_weeks.trim()} weeks` : 'not specified',
		target_weight,
		urgency: goal.urgency.trim() || 'not specified',
		training_days_per_week: trainingDays(training),
		training_location: training.location.trim() || 'not specified',
		fitness_level: training.fitness_level.trim() || 'not specified',
		injuries: training.injuries.trim() ? training.injuries.trim() : 'none',
		dietary_preference: diet.preference.trim() || 'not specified',
		food_dislikes: diet.food_dislikes.trim() ? diet.food_dislikes.trim() : 'none',
		allergies_intolerances: diet.allergies.trim() ? diet.allergies.trim() : 'none',
		medication_or_condition_flag,
		meals_per_day: diet.meals_per_day.trim() || 'not specified',
		cooking_time: (() => {
			const k = diet.cooking_time.trim();
			if (!k) return 'not specified';
			return COOKING_TIME_LABEL[k] ?? k;
		})(),
		meal_prep: (() => {
			const k = diet.meal_prep.trim();
			if (!k) return 'not specified';
			return MEAL_PREP_LABEL[k] ?? k;
		})(),
		cooking_equipment: diet.equipment.trim() || 'not specified',
		supplements_owned: supplements.owned.trim() || 'none listed',
		supplement_budget: (() => {
			const k = supplements.budget.trim();
			if (!k) return 'not specified';
			return SUPP_BUDGET_LABEL[k] ?? k;
		})(),
		other_supplements: supplements.other.trim() ? supplements.other.trim() : 'none',
		country: lifestyle.country.trim() || 'not specified',
		city: lifestyle.city.trim() || 'not provided',
		activity_outside_gym: (() => {
			const k = lifestyle.activity_outside_gym.trim();
			if (!k) return 'not specified';
			return ACTIVITY_OUTSIDE_LABEL[k] ?? k;
		})(),
		sleep_hours: lifestyle.sleep_hours.trim() || 'not specified',
		stress_level: lifestyle.stress_level.trim() || 'not specified',
		biggest_challenges: lifestyle.biggest_challenges.trim()
			? lifestyle.biggest_challenges.trim()
			: 'not specified',
		wake_time_clock: lifestyle.wake_time.trim() || 'not specified',
		sleep_time_clock: lifestyle.sleep_time.trim() || 'not specified',
		training_time_clock: lifestyle.training_time.trim() || 'not specified',
		intake_source: 'Health PWA SvelteKit — intake v2 (six steps)'
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
