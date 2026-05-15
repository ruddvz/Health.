import type { ProgressV2 } from '$lib/types/planV2';
import { logicalDateKeyFromIso, rollingLogicalDayKeys } from './dateKey';

/** Seven bars aligned to rolling logical days (oldest → newest). */
export function adherenceBars7d(
	progress: ProgressV2,
	now = new Date(),
	settings: Record<string, unknown> = {}
): number[] {
	const { keys } = rollingLogicalDayKeys(now, settings);
	const bars: number[] = [];
	for (const key of keys) {
		let score = 0.35;
		const water = progress.waterLitersByDay?.[key] ?? 0;
		if (water >= 2.0) score += 0.25;
		else if (water >= 1.2) score += 0.15;
		const trained = (progress.workoutSessions ?? []).some(
			(s) => logicalDateKeyFromIso(s.finishedAt, settings) === key
		);
		if (trained) score += 0.35;
		const checked = (progress.weeklyCheckins ?? []).some(
			(c) => logicalDateKeyFromIso(c.date, settings) === key
		);
		if (checked) score += 0.2;
		const loggedFood =
			(progress.extraMeals ?? []).some((m) => m.day === key) ||
			(progress.quickFixItems ?? []).some((q) => q.day === key);
		if (loggedFood) score += 0.1;
		bars.push(Math.min(1, score));
	}
	return bars;
}
