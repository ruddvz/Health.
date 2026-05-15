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

export interface ProgressV2 {
	weightEntries?: { date: string; kg: number }[];
	weeklyCheckins?: Record<string, unknown>[];
	workoutSession?: {
		startedAt: string;
		dayIndex: number;
		exerciseIndex: number;
		sets: { reps?: string; weight_kg?: string; done?: boolean }[][];
	};
	groceryChecked?: Record<string, boolean>;
	prepChecked?: Record<string, boolean>;
	suppChecked?: Record<string, boolean>;
}
