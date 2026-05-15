import { describe, it, expect } from 'vitest';
import {
	consumedTotalsForToday,
	plannedMacrosFromMeals,
	parseMacroGrams
} from '$lib/logic/dayTotals';
import { logicalDateKey } from '$lib/logic/dateKey';
import { mealSlotKey } from '$lib/logic/mealSlots';
import type { MealRow } from '$lib/logic/planDerive';
import type { PlanV2, ProgressV2 } from '$lib/types/planV2';

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

	it('counts only logged template meals toward consumed baseline', () => {
		const ref = new Date('2030-06-15T14:00:00');
		const day = logicalDateKey(ref, {});
		const plan = {
			phases: [{ protein_g: 200, carbs_g: 200, fat_g: 60, kcal_daily: 2000 }],
			meal_plan: {
				workout_day: [
					{
						slot: 1,
						time: '08:00',
						name: 'A',
						kcal: 300,
						ingredients: [],
						protein_g: 20,
						carbs_g: 30,
						fat_g: 10
					},
					{
						slot: 2,
						time: '13:00',
						name: 'B',
						kcal: 400,
						ingredients: [],
						protein_g: 25,
						carbs_g: 35,
						fat_g: 12
					}
				]
			}
		} as PlanV2;
		const progress: ProgressV2 = {
			mealSlotStatus: {
				[mealSlotKey(day, 'workout', 1)]: 'logged'
			}
		};
		const t = consumedTotalsForToday(plan, 'workout', 0, progress, {}, ref);
		expect(t.day).toBe(day);
		expect(t.kcal).toBe(300);
		expect(t.protein).toBeCloseTo(20, 2);
	});
});
