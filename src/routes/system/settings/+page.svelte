<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import RedActionButton from '$lib/components/nothing/RedActionButton.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { LS_PLAN } from '$lib/constants/storage';
	import {
		activeDayType,
		clearAllLocalHealthData,
		onboarding,
		persistSettings,
		plan,
		progress,
		settings
	} from '$lib/stores/healthApp';
	import { get } from 'svelte/store';

	const ZONE_PRESETS = [
		{ v: '', label: 'Device default' },
		{ v: 'UTC', label: 'UTC' },
		{ v: 'America/New_York', label: 'America / New York' },
		{ v: 'America/Chicago', label: 'America / Chicago' },
		{ v: 'America/Denver', label: 'America / Denver' },
		{ v: 'America/Los_Angeles', label: 'America / Los Angeles' },
		{ v: 'Europe/London', label: 'Europe / London' },
		{ v: 'Europe/Paris', label: 'Europe / Paris' },
		{ v: 'Asia/Tokyo', label: 'Asia / Tokyo' },
		{ v: 'Asia/Singapore', label: 'Asia / Singapore' },
		{ v: 'Australia/Sydney', label: 'Australia / Sydney' }
	];

	let tzPreset = $state('');
	let tzCustom = $state('');
	let boundaryHour = $state(0);

	$effect(() => {
		const s = $settings;
		const cur = typeof s.timeZone === 'string' ? s.timeZone : '';
		tzCustom = ZONE_PRESETS.some((z) => z.v === cur) ? '' : cur;
		tzPreset = ZONE_PRESETS.some((z) => z.v === cur) ? cur : '';
		const bh = s.dayBoundaryHour;
		boundaryHour =
			typeof bh === 'number' && Number.isFinite(bh)
				? Math.min(23, Math.max(0, Math.floor(bh)))
				: typeof bh === 'string' && bh.trim()
					? Math.min(23, Math.max(0, Math.floor(Number(bh))))
					: 0;
	});

	function saveCalendar() {
		const tz = tzCustom.trim() || tzPreset.trim() || '';
		const next: Record<string, unknown> = { ...get(settings) };
		if (tz) next.timeZone = tz;
		else delete next.timeZone;
		next.dayBoundaryHour = boundaryHour;
		persistSettings(next);
	}

	function exportFullBackup() {
		if (!browser) return;
		const payload = {
			exportVersion: 1 as const,
			exportedAt: new Date().toISOString(),
			plan: get(plan),
			progress: get(progress),
			settings: get(settings),
			onboarding: get(onboarding),
			activeDayType: get(activeDayType)
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'health-full-backup.json';
		a.click();
		URL.revokeObjectURL(a.href);
	}

	function exportPlanOnly() {
		const p = get(plan);
		if (!p || !browser) return;
		const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'health-plan-backup.json';
		a.click();
		URL.revokeObjectURL(a.href);
	}

	function wipe() {
		const ok = window.confirm(
			'Delete all local app data from this device? This cannot be undone unless you exported a backup.'
		);
		if (!ok) return;
		clearAllLocalHealthData();
		goto(resolve('/'));
	}
</script>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ScreenHeaderBlock title="SETTINGS" subtitle="Data, calendar & backups" />

	<p class="mono-caps lab">Calendar</p>
	<p class="txt">
		Logical “day” for meal intake, water, and charts. Hours before the boundary belong to the
		previous day in your chosen time zone.
	</p>
	<label class="field">
		<span class="mono-caps">Time zone</span>
		<select class="inp" bind:value={tzPreset}>
			{#each ZONE_PRESETS as z (z.v)}
				<option value={z.v}>{z.label}</option>
			{/each}
		</select>
	</label>
	<label class="field">
		<span class="mono-caps">Custom IANA (optional)</span>
		<input
			class="inp"
			type="text"
			placeholder="e.g. Europe/Berlin"
			bind:value={tzCustom}
			autocomplete="off"
			spellcheck={false}
		/>
	</label>
	<label class="field">
		<span class="mono-caps">Day starts at (hour 0–23)</span>
		<input class="inp" type="number" min="0" max="23" bind:value={boundaryHour} />
	</label>
	<button type="button" class="save pressable" onclick={saveCalendar}>Save calendar settings</button
	>

	<p class="mono-caps lab">Export</p>
	<p class="txt">
		Full backup includes your plan, progress logs (meals, water, workouts, check-ins), settings,
		onboarding answers, and active day type. Plan-only export matches the raw JSON you imported.
	</p>
	<p class="mono-caps sub">
		Plan in browser: {browser ? (localStorage.getItem(LS_PLAN) ? 'present' : 'empty') : '—'}
	</p>
	<RedActionButton label="Download full backup" disabled={!$plan} onclick={exportFullBackup} />
	<button type="button" class="secondary pressable" disabled={!$plan} onclick={exportPlanOnly}>
		Download plan JSON only
	</button>

	<p class="mono-caps lab danger">Danger zone</p>
	<p class="txt">
		Clears keys: health.v2.plan, progress, grocery, settings, activeDayType, onboarding.
	</p>
	<button type="button" class="del pressable" onclick={wipe}>Delete all local data</button>
</main>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.lab {
		margin: var(--space-4) 0 var(--space-2);
		font-size: 10px;
		color: var(--text-3);
	}

	.lab.danger {
		color: var(--red);
	}

	.txt {
		margin: 0 0 var(--space-3);
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-2);
	}

	.sub {
		margin: 0 0 var(--space-3);
		font-size: 9px;
		color: var(--text-3);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: var(--space-3);
	}

	.inp {
		padding: 10px 12px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-1);
		font-size: 15px;
	}

	.save {
		width: 100%;
		min-height: 48px;
		margin-bottom: var(--space-5);
		border-radius: var(--radius-sm);
		border: 1px solid var(--line-2);
		background: var(--surface-2);
		color: var(--text-1);
		font-weight: 650;
		cursor: pointer;
	}

	.secondary {
		width: 100%;
		min-height: 48px;
		margin-top: var(--space-2);
		border-radius: var(--radius-sm);
		border: 1px solid var(--line-2);
		background: transparent;
		color: var(--text-1);
		font-weight: 650;
		cursor: pointer;
	}

	.secondary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.del {
		width: 100%;
		min-height: 52px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--red-line);
		background: rgba(255, 42, 42, 0.12);
		color: var(--red);
		font-weight: 650;
		font-size: 15px;
		cursor: pointer;
	}
</style>
