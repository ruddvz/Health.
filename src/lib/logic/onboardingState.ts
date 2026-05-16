import type {
	OnboardingState,
	PrimaryGoalKey,
	TimelineWeeksKey,
	UrgencyKey
} from '$lib/types/planV2';

function isRecord(x: unknown): x is Record<string, unknown> {
	return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function str(x: unknown, fallback = ''): string {
	return typeof x === 'string' ? x : fallback;
}

function bool(x: unknown): boolean {
	return x === true;
}

function clampStep(n: number): OnboardingState['step'] {
	if (!Number.isFinite(n) || n < 1) return 1;
	if (n > 6) return 6;
	return n as OnboardingState['step'];
}

const GOAL_KEYS = new Set<string>(['fat_loss', 'muscle_gain', 'recomp', 'maintenance']);

function mapLegacyActivityLevel(level: string): string {
	if (level === 'low') return 'sedentary';
	if (level === 'moderate') return 'light';
	if (level === 'high') return 'active_job';
	return '';
}

export function defaultOnboardingState(): OnboardingState {
	return {
		step: 1,
		confirmed: false,
		intakeFormatVersion: 2,
		expandedIntakeNoticePending: false,
		profile: {
			name: '',
			age: '',
			sex: '',
			height_unit: 'cm',
			height_cm: '',
			height_ft: '',
			height_in: '',
			weight_unit: 'kg',
			weight_kg: '',
			weight_lbs: '',
			body_fat_pct: ''
		},
		goal: {
			primary_goal: '',
			timeline_weeks: '',
			target_weight: '',
			urgency: '',
			notes: ''
		},
		training: {
			days_per_week: '4',
			location: '',
			fitness_level: '',
			injuries: ''
		},
		diet: {
			preference: '',
			food_dislikes: '',
			allergies: '',
			medication_warning: false,
			meals_per_day: '',
			cooking_time: '',
			meal_prep: '',
			equipment: ''
		},
		supplements: {
			owned: '',
			budget: '',
			other: ''
		},
		lifestyle: {
			country: '',
			city: '',
			wake_time: '',
			sleep_time: '',
			training_time: '',
			activity_outside_gym: '',
			sleep_hours: '7',
			stress_level: '',
			biggest_challenges: ''
		}
	};
}

/** Merge unknown localStorage JSON into a complete `OnboardingState` (handles pre–six-step saves). */
export function normalizeOnboarding(raw: unknown): OnboardingState {
	const d = defaultOnboardingState();
	if (!isRecord(raw)) return d;

	const out: OnboardingState = {
		...d,
		step: clampStep(Number(raw.step)),
		confirmed: bool(raw.confirmed)
	};

	const newShape = isRecord(raw.goal) && isRecord(raw.training) && isRecord(raw.diet);

	if (newShape) {
		const p = isRecord(raw.profile) ? raw.profile : {};
		out.profile = {
			...d.profile,
			name: str(p.name, d.profile.name),
			age: str(p.age, d.profile.age),
			sex: str(p.sex, d.profile.sex),
			height_unit: p.height_unit === 'ftin' ? 'ftin' : 'cm',
			height_cm: str(p.height_cm, d.profile.height_cm),
			height_ft: str(p.height_ft, d.profile.height_ft),
			height_in: str(p.height_in, d.profile.height_in),
			weight_unit: p.weight_unit === 'lbs' ? 'lbs' : 'kg',
			weight_kg: str(p.weight_kg, d.profile.weight_kg),
			weight_lbs: str(p.weight_lbs, d.profile.weight_lbs),
			body_fat_pct: str(p.body_fat_pct, d.profile.body_fat_pct)
		};

		const g = raw.goal as Record<string, unknown>;
		const pg = str(g.primary_goal, '');
		out.goal = {
			primary_goal: GOAL_KEYS.has(pg) ? (pg as PrimaryGoalKey) : '',
			timeline_weeks: (['8', '12', '16', '20'].includes(str(g.timeline_weeks, ''))
				? str(g.timeline_weeks, '')
				: '') as TimelineWeeksKey | '',
			target_weight: str(g.target_weight, d.goal.target_weight),
			urgency: (['sustainable', 'balanced', 'aggressive'].includes(str(g.urgency, ''))
				? str(g.urgency, '')
				: '') as UrgencyKey | '',
			notes: str(g.notes, d.goal.notes)
		};

		const t = raw.training as Record<string, unknown>;
		out.training = {
			days_per_week: str(t.days_per_week, d.training.days_per_week),
			location: str(t.location, d.training.location),
			fitness_level: str(t.fitness_level, d.training.fitness_level),
			injuries: str(t.injuries, d.training.injuries)
		};

		const di = raw.diet as Record<string, unknown>;
		out.diet = {
			preference: str(di.preference, d.diet.preference),
			food_dislikes: str(di.food_dislikes, d.diet.food_dislikes),
			allergies: str(di.allergies, d.diet.allergies),
			medication_warning: bool(di.medication_warning),
			meals_per_day: str(di.meals_per_day, d.diet.meals_per_day),
			cooking_time: str(di.cooking_time, d.diet.cooking_time),
			meal_prep: str(di.meal_prep, d.diet.meal_prep),
			equipment: str(di.equipment, d.diet.equipment)
		};

		const s = raw.supplements as Record<string, unknown>;
		out.supplements = {
			owned: str(s.owned, d.supplements.owned),
			budget: str(s.budget, d.supplements.budget),
			other: str(s.other, d.supplements.other)
		};

		const l = raw.lifestyle as Record<string, unknown>;
		out.lifestyle = {
			country: str(l.country, d.lifestyle.country),
			city: str(l.city, d.lifestyle.city),
			wake_time: str(l.wake_time, d.lifestyle.wake_time),
			sleep_time: str(l.sleep_time, d.lifestyle.sleep_time),
			training_time: str(l.training_time, d.lifestyle.training_time),
			activity_outside_gym: str(l.activity_outside_gym, d.lifestyle.activity_outside_gym),
			sleep_hours: str(l.sleep_hours, d.lifestyle.sleep_hours),
			stress_level: str(l.stress_level, d.lifestyle.stress_level),
			biggest_challenges: str(l.biggest_challenges, d.lifestyle.biggest_challenges)
		};

		out.intakeFormatVersion =
			typeof raw.intakeFormatVersion === 'number' && Number.isFinite(raw.intakeFormatVersion)
				? Math.max(1, Math.floor(raw.intakeFormatVersion))
				: 2;
		out.expandedIntakeNoticePending = bool(raw.expandedIntakeNoticePending);

		return out;
	}

	// Legacy 4-step shape: profile.goal string, lifestyle.activity_level
	const p = isRecord(raw.profile) ? raw.profile : {};
	out.profile = {
		...d.profile,
		name: str(p.name, d.profile.name),
		age: str(p.age, d.profile.age),
		sex: str(p.sex, d.profile.sex),
		height_cm: str(p.height_cm, d.profile.height_cm),
		weight_kg: str(p.weight_kg, d.profile.weight_kg)
	};

	const legacyGoal = str(p.goal, '').trim();
	if (GOAL_KEYS.has(legacyGoal)) out.goal.primary_goal = legacyGoal as PrimaryGoalKey;
	else if (legacyGoal) out.goal.notes = legacyGoal;

	const life = isRecord(raw.lifestyle) ? raw.lifestyle : {};
	out.lifestyle.wake_time = str(life.wake_time, out.lifestyle.wake_time);
	out.lifestyle.sleep_time = str(life.sleep_time, out.lifestyle.sleep_time);
	out.lifestyle.training_time = str(life.training_time, out.lifestyle.training_time);
	const mapped = mapLegacyActivityLevel(str(life.activity_level, ''));
	if (mapped) out.lifestyle.activity_outside_gym = mapped;

	out.intakeFormatVersion = 2;
	out.expandedIntakeNoticePending = true;

	const oldStep = clampStep(Number(raw.step));
	if (bool(raw.confirmed)) {
		out.step = 6;
	} else {
		out.step = oldStep;
	}

	return out;
}
