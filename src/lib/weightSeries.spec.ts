import { describe, it, expect } from 'vitest';
import { logicalDateKey } from '$lib/logic/dateKey';
import { buildWeightChartModel } from '$lib/logic/weightSeries';
import type { ProgressV2 } from '$lib/types/planV2';

describe('weightSeries', () => {
	it('uses the last weight entry when duplicates exist for one day', () => {
		const key = logicalDateKey(new Date(), {});
		const p: ProgressV2 = {
			weightEntries: [
				{ date: key, kg: 80 },
				{ date: key, kg: 79.2 }
			]
		};
		const m = buildWeightChartModel(p, {});
		expect(m.valueLabel).toContain('79.2');
	});

	it('handles sparse data without throwing', () => {
		const p: ProgressV2 = {};
		const m = buildWeightChartModel(p, {});
		expect(m.labels.length).toBe(7);
		expect(m.series.length).toBe(7);
	});
});
