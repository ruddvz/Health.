import type { ProgressV2 } from '$lib/types/planV2';
import { isoDateKey } from './dateKey';

function dayAtOffset(from: Date, offset: number) {
	const d = new Date(from);
	d.setDate(d.getDate() + offset);
	return isoDateKey(d);
}

/** Seven bars for the trailing week: blend of hydration, training completion, and check-ins. */
export function adherenceBars7d(progress: ProgressV2, now = new Date()): number[] {
	const bars: number[] = [];
	for (let i = 6; i >= 0; i--) {
		const key = dayAtOffset(now, -i);
		let score = 0.35;
		const water = progress.waterLitersByDay?.[key] ?? 0;
		if (water >= 2.0) score += 0.25;
		else if (water >= 1.2) score += 0.15;
		const trained = (progress.workoutSessions ?? []).some((s) => s.finishedAt.startsWith(key));
		if (trained) score += 0.35;
		const checked = (progress.weeklyCheckins ?? []).some((c) => c.date.startsWith(key));
		if (checked) score += 0.2;
		const loggedFood =
			(progress.extraMeals ?? []).some((m) => m.day === key) ||
			(progress.quickFixItems ?? []).some((q) => q.day === key);
		if (loggedFood) score += 0.1;
		bars.push(Math.min(1, score));
	}
	return bars;
}
