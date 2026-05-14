<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import MetricRing from '$lib/components/spec/MetricRing.svelte';
	import MetricTile from '$lib/components/spec/MetricTile.svelte';
	import NextActionCard from '$lib/components/spec/NextActionCard.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SegmentedControl from '$lib/components/spec/SegmentedControl.svelte';
	import SectionLabel from '$lib/components/spec/SectionLabel.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import TimelineCard from '$lib/components/spec/TimelineCard.svelte';
	import { consumedTotalsForToday, waterLitersForDay } from '$lib/logic/dayTotals';
	import { isoDateKey } from '$lib/logic/dateKey';
	import {
		getMealsForDay,
		getPhaseLabel,
		getTrainingDay,
		getUserName,
		greeting
	} from '$lib/logic/planDerive';
	import {
		activeDayType,
		persistActiveDayType,
		persistProgress,
		plan,
		progress
	} from '$lib/stores/healthApp';
	import type { DayType } from '$lib/types/planV2';
	import { get } from 'svelte/store';

	let phaseIndex = $state(0);

	const totals = $derived(
		consumedTotalsForToday($plan, $activeDayType as DayType, phaseIndex, $progress)
	);
	const meals = $derived(getMealsForDay($plan, $activeDayType as DayType));

	const waterTarget = 3;
	const waterL = $derived(waterLitersForDay($progress, totals.day));

	const calProg = $derived(
		totals.targets.kcal > 0 ? Math.min(1, totals.kcal / totals.targets.kcal) : 0
	);

	const timeline = $derived.by(() => {
		const items: {
			time: string;
			title: string;
			subtitle: string;
			state: 'done' | 'next' | 'upcoming';
		}[] = [];
		for (let i = 0; i < meals.length; i++) {
			const m = meals[i];
			items.push({
				time: m.time,
				title: `Meal ${m.slot}`,
				subtitle: m.name,
				state: i === 0 ? 'done' : i === 1 ? 'next' : 'upcoming'
			});
		}
		const td = getTrainingDay($plan, 0);
		if (td && typeof td.name === 'string' && $activeDayType === 'workout') {
			items.push({
				time: '6:00 PM',
				title: 'Train',
				subtitle: String(td.name),
				state: items.length === 1 ? 'next' : 'upcoming'
			});
		}
		return items.length
			? items
			: [
					{
						time: '—',
						title: 'No schedule',
						subtitle: 'Add meals in your plan',
						state: 'next' as const
					}
				];
	});

	const nextTitle = $derived.by(() => {
		const td = getTrainingDay($plan, 0);
		if ($activeDayType === 'workout' && td && typeof td.name === 'string') return String(td.name);
		return 'Recovery day';
	});

	function bumpWater(delta: number) {
		const cur = get(progress);
		const key = isoDateKey();
		const prev = waterLitersForDay(cur, key);
		const next = Math.max(0, Math.round((prev + delta) * 100) / 100);
		persistProgress({
			...cur,
			waterLitersByDay: { ...(cur.waterLitersByDay ?? {}), [key]: next }
		});
	}

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="TODAY" subtitle="{greeting()}, {getUserName($plan)}" />

		<div class="phase mono-caps">{getPhaseLabel($plan, phaseIndex)}</div>

		<SegmentedControl
			options={[
				{ label: 'Workout Day', value: 'workout' },
				{ label: 'Rest Day', value: 'rest' }
			]}
			selected={$activeDayType}
			onSelect={(v) => persistActiveDayType(v as DayType)}
		/>

		<NextActionCard
			eyebrow="NEXT ACTION"
			title={nextTitle}
			subtitle={$activeDayType === 'workout' ? 'Start your workout' : 'Focus on recovery'}
			onclick={() => goto(resolve('/train'))}
		/>

		<SectionLabel text="MACROS" />

		<div class="rings">
			<MetricRing
				value={Math.min(totals.protein, totals.targets.protein)}
				max={Math.max(1, totals.targets.protein)}
				unit="g"
				label="Protein"
			/>
			<MetricRing
				value={Math.min(totals.carbs, totals.targets.carbs)}
				max={Math.max(1, totals.targets.carbs)}
				unit="g"
				label="Carbs"
			/>
			<MetricRing
				value={Math.min(totals.fat, totals.targets.fat)}
				max={Math.max(1, totals.targets.fat)}
				unit="g"
				label="Fat"
			/>
		</div>

		<div class="tiles">
			<div class="tile-wrap">
				<MetricTile
					label="WATER"
					value={`${waterL.toFixed(2)} / ${waterTarget.toFixed(1)} L`}
					subvalue={`${Math.round((waterL / waterTarget) * 100)}%`}
					progress={waterL / waterTarget}
				/>
				<div class="water-actions">
					<button type="button" class="mini pressable" onclick={() => bumpWater(-0.25)}>−</button>
					<button type="button" class="mini pressable" onclick={() => bumpWater(0.25)}>+</button>
				</div>
			</div>
			<MetricTile
				label="CALORIES"
				value={totals.kcal > 0 ? `${Math.round(totals.kcal).toLocaleString()}` : '—'}
				subvalue={totals.targets.kcal > 0
					? `/ ${Math.round(totals.targets.kcal).toLocaleString()} kcal`
					: ''}
				progress={calProg}
			/>
		</div>

		<SectionLabel text="TIMELINE" />
		<TimelineCard items={timeline} />
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.phase {
		margin: 0 0 var(--space-2);
		font-size: 10px;
		color: var(--text-2);
	}

	.rings {
		display: flex;
		justify-content: space-between;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.tiles {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin-bottom: var(--space-4);
	}

	.tile-wrap {
		position: relative;
	}

	.water-actions {
		position: absolute;
		right: 8px;
		bottom: 10px;
		display: flex;
		gap: 6px;
	}

	.mini {
		width: 34px;
		height: 30px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-2);
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-1);
		font-weight: 800;
		cursor: pointer;
	}
</style>
