import type { DayType, PlanV2 } from '$lib/types/planV2';

export function getUserName(plan: PlanV2 | null): string {
	const u = plan?.user as Record<string, unknown> | undefined;
	if (!u) return 'there';
	const n = u.name;
	return typeof n === 'string' && n.trim() ? n : 'there';
}

export function getPhaseLabel(plan: PlanV2 | null, index: number): string {
	const phases = plan?.phases;
	if (!Array.isArray(phases) || !phases[index]) return 'Phase';
	const p = phases[index] as Record<string, unknown>;
	const name = p.name;
	const weeks = p.weeks;
	if (typeof name === 'string')
		return typeof weeks === 'string' ? `${name} (${weeks})` : String(name);
	return `Phase ${index + 1}`;
}

export function getMealsForDay(plan: PlanV2 | null, day: DayType): MealRow[] {
	const mp = plan?.meal_plan as Record<string, unknown> | undefined;
	if (!mp) return [];
	const key = day === 'workout' ? 'workout_day' : 'rest_day';
	const arr = mp[key];
	if (!Array.isArray(arr)) return [];
	return arr.map((m, i) => {
		const row = m as Record<string, unknown>;
		return {
			slot: typeof row.slot === 'number' ? row.slot : i + 1,
			time: typeof row.time === 'string' ? row.time : '—',
			name: typeof row.name === 'string' ? row.name : 'Meal',
			kcal: typeof row.kcal === 'number' ? row.kcal : 0,
			protein: macroG(row, 'protein'),
			carbs: macroG(row, 'carbs'),
			fat: macroG(row, 'fat')
		};
	});
}

export interface MealRow {
	slot: number;
	time: string;
	name: string;
	kcal: number;
	protein: string;
	carbs: string;
	fat: string;
}

function macroG(row: Record<string, unknown>, key: string): string {
	const ings = row.ingredients;
	if (!Array.isArray(ings)) return '—';
	/* v2 sample may omit per-meal macros — show dash */
	const direct = row[`${key}_g`];
	if (typeof direct === 'number') return `${direct}g`;
	return '—';
}

export function sumMealKcal(meals: MealRow[]): number {
	return meals.reduce((a, m) => a + (m.kcal || 0), 0);
}

export function getPhaseTargets(plan: PlanV2 | null, phaseIndex: number) {
	const phases = plan?.phases;
	if (!Array.isArray(phases) || !phases[phaseIndex]) {
		return { protein: 0, carbs: 0, fat: 0, kcal: 0 };
	}
	const p = phases[phaseIndex] as Record<string, unknown>;
	return {
		protein: num(p.protein_g),
		carbs: num(p.carbs_g),
		fat: num(p.fat_g),
		kcal: num(p.kcal_daily)
	};
}

function num(v: unknown): number {
	return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
}

export function getTrainingDay(plan: PlanV2 | null, dayIndex: number) {
	const t = plan?.training as Record<string, unknown> | undefined;
	const split = t?.weekly_split;
	if (!Array.isArray(split) || !split[dayIndex]) return null;
	return split[dayIndex] as Record<string, unknown>;
}

export function flattenGrocery(
	plan: PlanV2 | null
): { store: string; name: string; qty: string; key: string }[] {
	const g = plan?.grocery as Record<string, unknown> | undefined;
	if (!g) return [];
	const out: { store: string; name: string; qty: string; key: string }[] = [];
	for (const [cat, val] of Object.entries(g)) {
		if (!Array.isArray(val)) continue;
		for (const item of val) {
			if (!item || typeof item !== 'object') continue;
			const it = item as Record<string, unknown>;
			const name = typeof it.name === 'string' ? it.name : 'Item';
			const qty =
				typeof it.qty === 'string' ? it.qty : typeof it.quantity === 'string' ? it.quantity : '';
			const store = typeof it.store === 'string' ? it.store : categoryToStore(cat);
			out.push({ store, name, qty, key: `${cat}:${name}` });
		}
	}
	return out;
}

function categoryToStore(cat: string): string {
	const c = cat.toLowerCase();
	if (c === 'veg' || c === 'vegetables') return 'GREENGROCER';
	return 'SUPERMARKET';
}

export function getPrepSteps(
	plan: PlanV2 | null
): { title: string; subtitle: string; minutes: number; key: string }[] {
	const pg = plan?.prep_guide as Record<string, unknown> | undefined;
	const steps = pg?.sunday_steps;
	if (!Array.isArray(steps)) return [];
	return steps.map((s, i) => {
		const row = (s || {}) as Record<string, unknown>;
		const name = typeof row.name === 'string' ? row.name : `Step ${i + 1}`;
		const detail = typeof row.detail === 'string' ? row.detail : '';
		const minutes = typeof row.minutes === 'number' ? row.minutes : 0;
		const key = `prep:${i}`;
		return { title: name, subtitle: detail, minutes, key };
	});
}

export function getSupplementSchedule(
	plan: PlanV2 | null
): { time: string; title: string; subtitle: string; key: string }[] {
	const sup = plan?.supplements as Record<string, unknown> | undefined;
	const sched = sup?.daily_schedule;
	if (!Array.isArray(sched)) return [];
	return sched.map((row, i) => {
		const r = (row || {}) as Record<string, unknown>;
		const label = typeof r.label === 'string' ? r.label : `Slot ${i + 1}`;
		const items = typeof r.items === 'string' ? r.items : '';
		const note = typeof r.note === 'string' ? r.note : '';
		return {
			time: labelToTime(label),
			title: items || 'Supplement',
			subtitle: note || 'Follow label directions.',
			key: `supp:${i}`
		};
	});
}

function labelToTime(label: string): string {
	const l = label.toLowerCase();
	if (l.includes('morning')) return '08:00';
	if (l.includes('afternoon')) return '12:00';
	if (l.includes('evening')) return '17:00';
	if (l.includes('night') || l.includes('bed')) return '21:30';
	return '—';
}

export function greeting(): string {
	const h = new Date().getHours();
	if (h < 12) return 'Good morning';
	if (h < 17) return 'Good afternoon';
	return 'Good evening';
}
