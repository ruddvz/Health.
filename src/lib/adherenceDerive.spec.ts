import { describe, it, expect } from 'vitest';
import { adherenceBars7d } from '$lib/logic/adherenceDerive';
import { logicalDateKey } from '$lib/logic/dateKey';
import type { ProgressV2 } from '$lib/types/planV2';

describe('adherenceDerive', () => {
	it('returns seven scores', () => {
		const p: ProgressV2 = {};
		expect(adherenceBars7d(p, new Date('2030-01-01T12:00:00'), {}).length).toBe(7);
	});

	it('boosts score when water and training exist on the same logical day', () => {
		const ref = new Date('2030-03-10T18:00:00.000Z');
		const day = logicalDateKey(ref, {});
		const p: ProgressV2 = {
			waterLitersByDay: { [day]: 2.1 },
			workoutSessions: [
				{
					id: '1',
					dayIndex: 0,
					startedAt: `${day}T10:00:00.000Z`,
					finishedAt: `${day}T11:00:00.000Z`,
					exercises: []
				}
			]
		};
		const bars = adherenceBars7d(p, ref, {});
		expect(Math.max(...bars)).toBeGreaterThan(0.85);
	});
});
