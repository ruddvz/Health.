import type { PlanV2 } from '$lib/types/planV2';

const REQUIRED_TOP = [
	'meta',
	'user',
	'phases',
	'meal_plan',
	'prep_guide',
	'grocery',
	'supplements'
] as const;

export type ParsePlanResult =
	| { ok: true; plan: PlanV2; warnings: string[] }
	| { ok: false; error: string; warnings: string[] };

/** Trim BOM, optional ```json fences, and outer whitespace from pasted / exported text. */
export function normalizeImportedPlanJsonText(text: string): string {
	let s = text.trim();
	if (s.charCodeAt(0) === 0xfeff) s = s.slice(1).trim();
	const open = s.match(/^```(?:json)?\s*\r?\n?/i);
	if (open) {
		s = s.slice(open[0].length);
		const close = s.lastIndexOf('```');
		if (close !== -1) s = s.slice(0, close);
		s = s.trim();
	}
	return s;
}

export function parsePlanJsonText(text: string): ParsePlanResult {
	let data: unknown;
	try {
		data = JSON.parse(normalizeImportedPlanJsonText(text));
	} catch (e) {
		const msg = e instanceof Error ? e.message : 'Invalid JSON';
		return { ok: false, error: `JSON parse error: ${msg}`, warnings: [] };
	}
	return validatePlanUnknown(data);
}

export function validatePlanUnknown(data: unknown): ParsePlanResult {
	const warnings: string[] = [];

	if (!data || typeof data !== 'object' || Array.isArray(data)) {
		return { ok: false, error: 'Plan must be a JSON object.', warnings };
	}

	const o = data as Record<string, unknown>;
	for (const key of REQUIRED_TOP) {
		if (!(key in o) || o[key] == null) {
			return { ok: false, error: `Missing required section: "${key}"`, warnings };
		}
	}

	if (!Array.isArray(o.phases)) {
		return { ok: false, error: '"phases" must be an array.', warnings };
	}

	if (!o.meal_plan || typeof o.meal_plan !== 'object' || Array.isArray(o.meal_plan)) {
		return { ok: false, error: '"meal_plan" must be an object.', warnings };
	}

	warnings.push(...runCoreWarnings(o));

	return { ok: true, plan: o as PlanV2, warnings };
}

/** Spec `core_warnings` — lightweight heuristics only */
function runCoreWarnings(o: Record<string, unknown>): string[] {
	const w: string[] = [];
	const phases = o.phases;
	const meal_plan = o.meal_plan as Record<string, unknown> | undefined;
	const training = o.training as Record<string, unknown> | undefined;

	if (Array.isArray(phases) && phases.length && meal_plan) {
		const wd = meal_plan.workout_day;
		if (Array.isArray(wd)) {
			let sum = 0;
			for (const m of wd) {
				if (
					m &&
					typeof m === 'object' &&
					'kcal' in m &&
					typeof (m as { kcal: unknown }).kcal === 'number'
				) {
					sum += (m as { kcal: number }).kcal;
				}
			}
			const p0 = phases[0] as Record<string, unknown>;
			const target = typeof p0?.kcal_daily === 'number' ? (p0.kcal_daily as number) : null;
			if (target != null && sum > 0 && Math.abs(sum - target) > 100) {
				w.push(
					'Meal calories differ from phase target by more than 100 kcal (workout day sum vs phase kcal).'
				);
			}
		}
	}

	if (training && typeof training === 'object') {
		const split = training.weekly_split;
		if (!Array.isArray(split) || split.length === 0) {
			w.push('Training notes may exist but weekly_split is empty or missing.');
		}
	}

	const sup = o.supplements as Record<string, unknown> | undefined;
	if (sup && typeof sup === 'object') {
		const stack = sup.stack;
		if (Array.isArray(stack) && stack.length > 0) {
			const hasNote = stack.some((item) => {
				if (!item || typeof item !== 'object') return true;
				const it = item as Record<string, unknown>;
				return typeof it.safety_note === 'string' || typeof it.note === 'string';
			});
			if (!hasNote) {
				w.push('Supplement stack entries may be missing explicit safety / evidence notes.');
			}
		}
	}

	return w;
}
