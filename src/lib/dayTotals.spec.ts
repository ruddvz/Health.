import { describe, it, expect } from 'vitest';
import { plannedMacrosFromMeals, parseMacroGrams } from '$lib/logic/dayTotals';
import type { MealRow } from '$lib/logic/planDerive';

describe('dayTotals', () => {
	it('parses macro grams', () => {
		expect(parseMacroGrams('120g')).toBe(120);
		expect(parseMacroGrams('—')).toBeNull();
	});

	it('infers missing meal macros from phase targets', () => {
		const meals: MealRow[] = [
			{ slot: 1, time: '08:00', name: 'A', kcal: 500, protein: '—', carbs: '—', fat: '—' },
			{ slot: 2, time: '13:00', name: 'B', kcal: 500, protein: '40g', carbs: '—', fat: '—' }
		];
		const targets = { protein: 200, carbs: 200, fat: 60, kcal: 2000 };
		const m = plannedMacrosFromMeals(meals, targets);
		expect(m.kcal).toBe(1000);
		expect(m.protein).toBeGreaterThan(40);
	});
});
