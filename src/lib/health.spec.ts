import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parsePlanJsonText } from '$lib/validation/planV2';

const here = dirname(fileURLToPath(import.meta.url));
const samplePath = join(here, '../../samples/minimal-plan-v2.json');

describe('plan validation', () => {
	it('accepts minimal v2 sample', () => {
		const raw = readFileSync(samplePath, 'utf8');
		const r = parsePlanJsonText(raw);
		expect(r.ok).toBe(true);
		if (r.ok) {
			expect(Array.isArray(r.plan.phases)).toBe(true);
		}
	});

	it('accepts JSON wrapped in a markdown fence', () => {
		const raw = readFileSync(samplePath, 'utf8');
		const wrapped = '```json\n' + raw + '\n```';
		const r = parsePlanJsonText(wrapped);
		expect(r.ok).toBe(true);
	});

	it('accepts JSON with UTF-8 BOM', () => {
		const raw = readFileSync(samplePath, 'utf8');
		const r = parsePlanJsonText('\ufeff' + raw);
		expect(r.ok).toBe(true);
	});

	it('rejects invalid JSON', () => {
		const r = parsePlanJsonText('{');
		expect(r.ok).toBe(false);
	});
});
