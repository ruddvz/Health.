import type { DayType, MealSlotStatus, ProgressV2 } from '$lib/types/planV2';

export function mealSlotKey(dayKey: string, dayType: DayType, slot: number): string {
	return `${dayKey}:${dayType}:${slot}`;
}

export function getMealSlotState(
	progress: ProgressV2,
	dayKey: string,
	dayType: DayType,
	slot: number
): MealSlotStatus | 'pending' {
	const v = progress.mealSlotStatus?.[mealSlotKey(dayKey, dayType, slot)];
	if (v === 'logged' || v === 'skipped') return v;
	return 'pending';
}
