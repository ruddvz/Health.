export type CalendarPrefs = {
	timeZone?: string;
	dayBoundaryHour?: number;
};

export function readCalendarPrefs(settings: Record<string, unknown> | null | undefined): {
	timeZone: string;
	dayBoundaryHour: number;
} {
	const tzRaw = settings?.timeZone;
	const timeZone =
		typeof tzRaw === 'string' && tzRaw.trim().length > 0
			? tzRaw.trim()
			: Intl.DateTimeFormat().resolvedOptions().timeZone;
	const rawH = settings?.dayBoundaryHour;
	let dayBoundaryHour = 0;
	if (typeof rawH === 'number' && Number.isFinite(rawH))
		dayBoundaryHour = Math.min(23, Math.max(0, Math.floor(rawH)));
	else if (typeof rawH === 'string' && rawH.trim()) {
		const n = Number(rawH);
		if (Number.isFinite(n)) dayBoundaryHour = Math.min(23, Math.max(0, Math.floor(n)));
	}
	return { timeZone, dayBoundaryHour };
}

function zonedParts(d: Date, timeZone: string) {
	const dtf = new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		hour12: false
	});
	const o: Record<string, string> = {};
	for (const p of dtf.formatToParts(d)) {
		if (p.type !== 'literal') o[p.type] = p.value;
	}
	return {
		y: Number(o.year),
		m: Number(o.month),
		day: Number(o.day),
		h: Number(o.hour)
	};
}

function ymdKey(y: number, m: number, day: number) {
	return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Local calendar day in the device timezone (midnight boundary). */
export function isoDateKey(d = new Date()): string {
	return ymdKey(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * Logical calendar day for logging, using optional IANA `timeZone` and `dayBoundaryHour`
 * (0–23). Hours before the boundary belong to the previous calendar day in that zone.
 */
export function logicalDateKey(date: Date, settings?: Record<string, unknown> | null): string {
	const { timeZone, dayBoundaryHour } = readCalendarPrefs(settings);
	let cur = new Date(date.getTime());
	for (let i = 0; i < 48; i++) {
		const { y, m, day, h } = zonedParts(cur, timeZone);
		if (Number.isFinite(h) && h >= dayBoundaryHour) return ymdKey(y, m, day);
		cur = new Date(cur.getTime() - 60 * 60 * 1000);
	}
	return isoDateKey(date);
}

export function logicalDateKeyFromIso(
	iso: string,
	settings?: Record<string, unknown> | null
): string {
	const t = Date.parse(iso);
	if (!Number.isFinite(t)) return logicalDateKey(new Date(), settings);
	return logicalDateKey(new Date(t), settings);
}

/** Rolling window: labels use local weekday of each offset instant; keys use logical days. */
export function rollingLogicalDayKeys(now: Date, settings?: Record<string, unknown> | null) {
	const labels: string[] = [];
	const keys: string[] = [];
	const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	for (let i = 6; i >= 0; i--) {
		const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
		labels.push(wd[d.getDay()] ?? '—');
		keys.push(logicalDateKey(d, settings));
	}
	return { keys, labels };
}
