import type { ProgressV2 } from '$lib/types/planV2';

export interface WeightChartModel {
	labels: string[];
	series: number[];
	valueLabel: string;
	deltaLabel: string;
}

function dayKey(d: Date) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

function parseKg(s: string | undefined): number | null {
	if (!s) return null;
	const v = Number(String(s).replace(',', '.').trim());
	return Number.isFinite(v) ? v : null;
}

/** Last 7 calendar days sparkline from explicit weightEntries + check-in weights. */
export function buildWeightChartModel(progress: ProgressV2): WeightChartModel {
	const today = new Date();
	const labels: string[] = [];
	const raw: (number | null)[] = [];
	for (let i = 6; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		labels.push(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] ?? '—');
		const key = dayKey(d);
		let v: number | null = null;
		const fromEntries = (progress.weightEntries ?? []).filter((e) => e.date === key);
		if (fromEntries.length) {
			const last = fromEntries[fromEntries.length - 1];
			v = typeof last?.kg === 'number' ? last.kg : null;
		}
		if (v === null) {
			const cin = (progress.weeklyCheckins ?? []).find((c) => c.date.startsWith(key));
			v = parseKg(cin?.weight_kg ?? undefined);
		}
		raw.push(v);
	}
	const nums = raw.filter((x): x is number => x !== null);
	const last = nums.length ? nums[nums.length - 1] : null;
	const prev = nums.length > 1 ? nums[nums.length - 2] : null;
	const filled = raw.map((x, idx) => {
		if (x !== null) return x;
		// carry forward / backward simple imputation for chart only
		let b: number | null = null;
		for (let j = idx - 1; j >= 0; j--) {
			if (raw[j] !== null) {
				b = raw[j];
				break;
			}
		}
		let a: number | null = null;
		for (let j = idx + 1; j < raw.length; j++) {
			if (raw[j] !== null) {
				a = raw[j];
				break;
			}
		}
		if (b !== null && a !== null) return (b + a) / 2;
		if (b !== null) return b;
		if (a !== null) return a;
		return 75;
	});
	const min = Math.min(...filled);
	const max = Math.max(...filled);
	const span = Math.max(1e-6, max - min);
	const series = filled.map((kg) => (kg - min) / span);
	const valueLabel = last !== null ? `${last.toFixed(1)} kg` : '—';
	let deltaLabel = 'Log weight in check-ins';
	if (last !== null && prev !== null) {
		const d = last - prev;
		deltaLabel = `${d >= 0 ? '+' : ''}${d.toFixed(1)} kg vs prior log`;
	}
	return { labels, series, valueLabel, deltaLabel };
}
