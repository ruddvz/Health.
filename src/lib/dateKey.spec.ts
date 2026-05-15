import { describe, it, expect } from 'vitest';
import { logicalDateKey, readCalendarPrefs, rollingLogicalDayKeys } from '$lib/logic/dateKey';

describe('dateKey', () => {
	it('rolls logical day back before boundary hour', () => {
		const settings = { timeZone: 'UTC', dayBoundaryHour: 5 };
		const d = new Date('2030-02-02T03:00:00.000Z');
		expect(logicalDateKey(d, settings)).toBe('2030-02-01');
	});

	it('uses same calendar day after boundary hour', () => {
		const settings = { timeZone: 'UTC', dayBoundaryHour: 5 };
		const d = new Date('2030-02-02T06:00:00.000Z');
		expect(logicalDateKey(d, settings)).toBe('2030-02-02');
	});

	it('readCalendarPrefs falls back to device-like defaults', () => {
		const p = readCalendarPrefs({});
		expect(p.timeZone.length).toBeGreaterThan(0);
		expect(p.dayBoundaryHour).toBe(0);
	});

	it('rollingLogicalDayKeys returns parallel keys and labels', () => {
		const { keys, labels } = rollingLogicalDayKeys(new Date('2030-05-10T12:00:00'), {});
		expect(keys.length).toBe(7);
		expect(labels.length).toBe(7);
	});
});
