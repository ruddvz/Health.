/** Parsed health plan (v2) — intentionally permissive beyond validated sections. */
export type PlanV2 = Record<string, unknown> & {
	meta?: Record<string, unknown>;
	user?: Record<string, unknown>;
	phases?: unknown[];
	meal_plan?: Record<string, unknown>;
};

export type DayType = 'workout' | 'rest';

export type PrimaryGoalKey = 'fat_loss' | 'muscle_gain' | 'recomp' | 'maintenance';

export type TimelineWeeksKey = '8' | '12' | '16' | '20';

export type UrgencyKey = 'sustainable' | 'balanced' | 'aggressive';

/** Six-step intake aligned with legacy `profilePayload` fields for Claude. */
export interface OnboardingState {
	step: 1 | 2 | 3 | 4 | 5 | 6;
	confirmed: boolean;
	profile: {
		name: string;
		age: string;
		sex: string;
		height_unit: 'cm' | 'ftin';
		height_cm: string;
		height_ft: string;
		height_in: string;
		weight_unit: 'kg' | 'lbs';
		weight_kg: string;
		weight_lbs: string;
		body_fat_pct: string;
	};
	goal: {
		primary_goal: PrimaryGoalKey | '';
		timeline_weeks: TimelineWeeksKey | '';
		target_weight: string;
		urgency: UrgencyKey | '';
		notes: string;
	};
	training: {
		days_per_week: string;
		location: string;
		fitness_level: string;
		injuries: string;
	};
	diet: {
		preference: string;
		food_dislikes: string;
		allergies: string;
		medication_warning: boolean;
		meals_per_day: string;
		cooking_time: string;
		meal_prep: string;
		equipment: string;
	};
	supplements: {
		owned: string;
		budget: string;
		other: string;
	};
	lifestyle: {
		country: string;
		city: string;
		wake_time: string;
		sleep_time: string;
		training_time: string;
		activity_outside_gym: string;
		sleep_hours: string;
		stress_level: string;
		biggest_challenges: string;
	};
}

export interface WorkoutSetEntry {
	weight_kg?: string;
	reps?: string;
	done?: boolean;
}

export interface WorkoutExerciseLog {
	name: string;
	sets: WorkoutSetEntry[];
}

/** In-progress session (persisted so refresh does not lose sets). */
export interface ActiveWorkout {
	dayIndex: number;
	startedAt: string;
	exerciseIndex: number;
	exercises: WorkoutExerciseLog[];
}

export interface WorkoutSessionLog {
	id: string;
	dayIndex: number;
	startedAt: string;
	finishedAt: string;
	exercises: WorkoutExerciseLog[];
}

export interface ExtraMeal {
	id: string;
	day: string;
	name: string;
	time: string;
	kcal: number;
	protein_g?: number;
	carbs_g?: number;
	fat_g?: number;
}

export interface QuickFixItem {
	id: string;
	day: string;
	label: string;
	kcal: number;
	protein_g: number;
	carbs_g: number;
	fat_g: number;
}

export interface WeeklyCheckinEntry {
	id: string;
	date: string;
	weight_kg?: string;
	waist_cm?: string;
	energy_1_10?: string;
	sleep_hours?: string;
	notes?: string;
}

export type MealSlotStatus = 'logged' | 'skipped';

export interface ProgressV2 {
	weightEntries?: { date: string; kg: number }[];
	weeklyCheckins?: WeeklyCheckinEntry[];
	/** Last in-progress builder session */
	workoutSession?: {
		startedAt: string;
		dayIndex: number;
		exerciseIndex: number;
		sets: WorkoutSetEntry[][];
	};
	activeWorkout?: ActiveWorkout;
	workoutSessions?: WorkoutSessionLog[];
	groceryChecked?: Record<string, boolean>;
	prepChecked?: Record<string, boolean>;
	suppChecked?: Record<string, boolean>;
	extraMeals?: ExtraMeal[];
	quickFixItems?: QuickFixItem[];
	/** Liters logged per logical calendar day (see settings time zone / boundary). */
	waterLitersByDay?: Record<string, number>;
	/** Per-slot meal logging for a logical day, key `${day}:${dayType}:${slot}`. */
	mealSlotStatus?: Record<string, MealSlotStatus>;
}
