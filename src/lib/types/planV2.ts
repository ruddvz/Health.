/** Parsed health plan (v2) — intentionally permissive beyond validated sections. */
export type PlanV2 = Record<string, unknown> & {
	meta?: Record<string, unknown>;
	user?: Record<string, unknown>;
	phases?: unknown[];
	meal_plan?: Record<string, unknown>;
};

export type DayType = 'workout' | 'rest';

export interface OnboardingState {
	step: 1 | 2 | 3 | 4;
	profile: {
		name: string;
		age: string;
		sex: string;
		height_cm: string;
		weight_kg: string;
		goal: string;
	};
	lifestyle: {
		wake_time: string;
		sleep_time: string;
		training_time: string;
		activity_level: string;
	};
	confirmed: boolean;
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
	/** Liters logged per calendar day */
	waterLitersByDay?: Record<string, number>;
}
