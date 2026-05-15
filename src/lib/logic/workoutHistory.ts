import type { WorkoutSessionLog } from '$lib/types/planV2';

function parseKg(s: string | undefined): number | null {
	if (s === undefined) return null;
	const v = Number(String(s).replace(',', '.').trim());
	return Number.isFinite(v) ? v : null;
}

export function recentSessions(
	progress: { workoutSessions?: WorkoutSessionLog[] },
	limit = 5
): WorkoutSessionLog[] {
	const all = [...(progress.workoutSessions ?? [])];
	return all.slice(-limit).reverse();
}

export interface LiftStat {
	name: string;
	lastKg: number | null;
	bestKg: number | null;
}

/** Best logged weight per exercise, and most recent logged weight (sessions newest-first). */
export function liftStatsFromSessions(sessionsNewestFirst: WorkoutSessionLog[]): LiftStat[] {
	const last = new Map<string, number>();
	const best = new Map<string, number>();
	for (const s of sessionsNewestFirst) {
		for (const ex of s.exercises) {
			const name = ex.name;
			for (const st of ex.sets) {
				const w = parseKg(st.weight_kg);
				if (w === null) continue;
				if (!last.has(name)) last.set(name, w);
				best.set(name, Math.max(best.get(name) ?? 0, w));
			}
		}
	}
	const names = [...new Set([...last.keys(), ...best.keys()])].sort((a, b) => a.localeCompare(b));
	return names.map((name) => ({
		name,
		lastKg: last.get(name) ?? null,
		bestKg: best.has(name) ? (best.get(name) as number) : null
	}));
}
