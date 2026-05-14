import type { DayType, PlanV2, ProgressV2 } from '$lib/types/planV2';
import { isoDateKey } from './dateKey';
import { getMealsForDay, getPhaseTargets, type MealRow } from './planDerive';

export function parseMacroGrams(s: string): number | null {
	const m = /^([\d.]+)\s*g$/i.exec(String(s).trim());
	if (!m) return null;
	const v = Number(m[1]);
	return Number.isFinite(v) ? v : null;
}

/** Planned macros from template meals; missing per-meal macros are inferred from phase targets. */
export function plannedMacrosFromMeals(
	meals: MealRow[],
	targets: { protein: number; carbs: number; fat: number; kcal: number }
) {
	const tk = Math.max(1, targets.kcal);
	let protein = 0;
	let carbs = 0;
	let fat = 0;
	let kcal = 0;
	for (const m of meals) {
		kcal += m.kcal;
		const pg = parseMacroGrams(m.protein);
		const cg = parseMacroGrams(m.carbs);
		const fg = parseMacroGrams(m.fat);
		protein += pg ?? m.kcal * (targets.protein / tk);
		carbs += cg ?? m.kcal * (targets.carbs / tk);
		fat += fg ?? m.kcal * (targets.fat / tk);
	}
	return { protein, carbs, fat, kcal };
}

function sumExtrasForDay(progress: ProgressV2, day: string) {
	let kcal = 0;
	let protein = 0;
	let carbs = 0;
	let fat = 0;
	for (const e of progress.extraMeals ?? []) {
		if (e.day !== day) continue;
		kcal += e.kcal;
		protein += e.protein_g ?? 0;
		carbs += e.carbs_g ?? 0;
		fat += e.fat_g ?? 0;
	}
	return { kcal, protein, carbs, fat };
}

function sumQuickFixForDay(progress: ProgressV2, day: string) {
	let kcal = 0;
	let protein = 0;
	let carbs = 0;
	let fat = 0;
	for (const q of progress.quickFixItems ?? []) {
		if (q.day !== day) continue;
		kcal += q.kcal;
		protein += q.protein_g;
		carbs += q.carbs_g;
		fat += q.fat_g;
	}
	return { kcal, protein, carbs, fat };
}

export function consumedTotalsForToday(
	plan: PlanV2 | null,
	dayType: DayType,
	phaseIndex: number,
	progress: ProgressV2,
	date = new Date()
) {
	const day = isoDateKey(date);
	const targets = getPhaseTargets(plan, phaseIndex);
	const meals = getMealsForDay(plan, dayType);
	const base = plannedMacrosFromMeals(meals, targets);
	const ex = sumExtrasForDay(progress, day);
	const qf = sumQuickFixForDay(progress, day);
	return {
		day,
		protein: base.protein + ex.protein + qf.protein,
		carbs: base.carbs + ex.carbs + qf.carbs,
		fat: base.fat + ex.fat + qf.fat,
		kcal: base.kcal + ex.kcal + qf.kcal,
		targets
	};
}

export function waterLitersForDay(progress: ProgressV2, day: string): number {
	const w = progress.waterLitersByDay?.[day];
	return typeof w === 'number' && Number.isFinite(w) ? w : 0;
}
