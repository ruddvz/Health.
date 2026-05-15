<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import AdherenceCard from '$lib/components/spec/AdherenceCard.svelte';
	import ChartCard from '$lib/components/spec/ChartCard.svelte';
	import CheckinCard from '$lib/components/spec/CheckinCard.svelte';
	import ChipRow from '$lib/components/spec/ChipRow.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SectionLabel from '$lib/components/spec/SectionLabel.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { adherenceBars7d } from '$lib/logic/adherenceDerive';
	import { logicalDateKey } from '$lib/logic/dateKey';
	import { newId } from '$lib/logic/id';
	import { buildWeightChartModel } from '$lib/logic/weightSeries';
	import { liftStatsFromSessions, recentSessions } from '$lib/logic/workoutHistory';
	import { persistProgress, plan, progress, settings } from '$lib/stores/healthApp';
	import type { WeeklyCheckinEntry } from '$lib/types/planV2';
	import { get } from 'svelte/store';

	let chip = $state('Overview');
	let checkOpen = $state(false);
	let weightKg = $state('');
	let waistCm = $state('');
	let energy = $state('');
	let sleepH = $state('');
	let notes = $state('');

	const chart = $derived(buildWeightChartModel($progress, $settings));
	const bars = $derived(adherenceBars7d($progress, new Date(), $settings));
	const adherencePct = $derived(
		bars.length ? Math.round((bars.reduce((a, b) => a + b, 0) / bars.length) * 100) : 0
	);

	const histSessions = $derived(recentSessions($progress, 12));
	const sessions = $derived(recentSessions($progress, 5));
	const liftStats = $derived(liftStatsFromSessions(histSessions));

	function parseKg(s: string): number | null {
		const v = Number(String(s).replace(',', '.').trim());
		return Number.isFinite(v) ? v : null;
	}

	function saveCheckin() {
		const cur = get(progress);
		const entry: WeeklyCheckinEntry = {
			id: newId(),
			date: new Date().toISOString(),
			weight_kg: weightKg.trim() || undefined,
			waist_cm: waistCm.trim() || undefined,
			energy_1_10: energy.trim() || undefined,
			sleep_hours: sleepH.trim() || undefined,
			notes: notes.trim() || undefined
		};
		const nextCheckins = [...(cur.weeklyCheckins ?? []), entry];
		let weightEntries = [...(cur.weightEntries ?? [])];
		const wn = parseKg(weightKg);
		if (wn !== null) {
			const dk = logicalDateKey(new Date(), get(settings));
			weightEntries = [...weightEntries, { date: dk, kg: wn }];
		}
		persistProgress({ ...cur, weeklyCheckins: nextCheckins, weightEntries });
		checkOpen = false;
		weightKg = '';
		waistCm = '';
		energy = '';
		sleepH = '';
		notes = '';
	}

	function fmtShort(iso: string) {
		const t = Date.parse(iso);
		if (!Number.isFinite(t)) return iso;
		return new Intl.DateTimeFormat(undefined, {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}).format(new Date(t));
	}

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="PROGRESS" />

		<ChipRow
			chips={['Overview', 'Trends', 'Metrics']}
			selected={chip}
			onSelect={(c) => (chip = c)}
		/>

		<ChartCard
			title="WEIGHT TREND"
			value={chart.valueLabel}
			delta={chart.deltaLabel}
			labels={chart.labels}
			series={chart.series}
		/>

		<AdherenceCard
			title="ADHERENCE"
			value={`${adherencePct}%`}
			subtitle="7 day blend (water · training · check-ins)"
			{bars}
		/>

		<SectionLabel text="RECENT WORKOUTS" />
		{#if sessions.length === 0}
			<p class="empty">Finish a session from Train to build history here.</p>
		{:else}
			<ul class="list nothing-surface">
				{#each sessions as s (s.id)}
					<li class="row">
						<p class="mono-caps t">{fmtShort(s.finishedAt)}</p>
						<p class="b">{s.exercises.length} exercises · logged sets</p>
					</li>
				{/each}
			</ul>
		{/if}

		{#if liftStats.length}
			<SectionLabel text="LAST LOGGED WEIGHTS" />
			<div class="lift nothing-surface">
				{#each liftStats as ls (ls.name)}
					<div class="lr">
						<p class="nm">{ls.name}</p>
						<p class="vals mono-caps">
							Last {ls.lastKg !== null ? `${ls.lastKg} kg` : '—'} · Best {ls.bestKg !== null
								? `${ls.bestKg} kg`
								: '—'}
						</p>
					</div>
				{/each}
			</div>
		{/if}

		<CheckinCard
			title="WEEKLY CHECK-IN"
			question="How was your week?"
			subtitle="Log weight, waist, energy, sleep, and notes."
			cta="Log Check-in"
			onclick={() => (checkOpen = true)}
		/>
	</main>
{/if}

{#if checkOpen}
	<div class="modal" role="presentation">
		<button type="button" class="backdrop" aria-label="Close" onclick={() => (checkOpen = false)}
		></button>
		<div class="sheet nothing-surface" role="dialog" aria-modal="true" aria-labelledby="chk-h">
			<h2 id="chk-h" class="mono-caps h">Weekly check-in</h2>
			<p class="sub">Stored locally. Weight also feeds the trend chart.</p>
			<label class="field">
				<span class="mono-caps">Weight (kg)</span>
				<input class="inp" type="text" bind:value={weightKg} placeholder="e.g. 74.2" />
			</label>
			<label class="field">
				<span class="mono-caps">Waist (cm)</span>
				<input class="inp" type="text" bind:value={waistCm} placeholder="optional" />
			</label>
			<div class="row2">
				<label class="field">
					<span class="mono-caps">Energy (1–10)</span>
					<input class="inp" type="text" bind:value={energy} placeholder="7" />
				</label>
				<label class="field">
					<span class="mono-caps">Sleep (h)</span>
					<input class="inp" type="text" bind:value={sleepH} placeholder="7.5" />
				</label>
			</div>
			<label class="field">
				<span class="mono-caps">Notes</span>
				<textarea class="ta" rows="3" bind:value={notes} placeholder="Short reflection"></textarea>
			</label>
			<div class="row">
				<button type="button" class="ghost pressable" onclick={() => (checkOpen = false)}
					>Cancel</button
				>
				<button type="button" class="red pressable" onclick={saveCheckin}>Save</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.empty {
		margin: 0 0 var(--space-3);
		font-size: 14px;
		color: var(--text-2);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--space-4);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.row {
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--line-1);
	}

	.row:last-child {
		border-bottom: none;
	}

	.t {
		margin: 0;
		font-size: 9px;
		color: var(--text-3);
	}

	.b {
		margin: 6px 0 0;
		font-size: 14px;
		color: var(--text-1);
	}

	.lift {
		padding: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.lr {
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--line-1);
	}

	.lr:last-child {
		border-bottom: none;
	}

	.nm {
		margin: 0;
		font-size: 14px;
		font-weight: 650;
		color: var(--text-1);
	}

	.vals {
		margin: 6px 0 0;
		font-size: 9px;
		color: var(--text-3);
	}

	.modal {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		border: none;
		background: rgba(0, 0, 0, 0.55);
		cursor: pointer;
	}

	.sheet {
		position: relative;
		width: min(100vw, 430px);
		padding: var(--space-4);
		border-radius: 18px 18px 0 0;
		border: 1px solid var(--line-1);
		max-height: 90dvh;
		overflow: auto;
	}

	.h {
		margin: 0 0 var(--space-2);
		font-size: 11px;
		color: var(--text-2);
	}

	.sub {
		margin: 0 0 var(--space-3);
		font-size: 13px;
		color: var(--text-3);
		line-height: 1.45;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: var(--space-3);
	}

	.inp,
	.ta {
		padding: 10px 12px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-1);
		font-size: 16px;
	}

	.ta {
		resize: vertical;
		font-family: var(--font-ui);
	}

	.row2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}

	.row {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.ghost,
	.red {
		flex: 1;
		min-height: 48px;
		border-radius: var(--radius-sm);
		font-weight: 650;
		cursor: pointer;
		border: 1px solid var(--line-2);
		background: transparent;
		color: var(--text-1);
	}

	.red {
		background: var(--red);
		border-color: var(--red);
		color: #fff;
	}
</style>
