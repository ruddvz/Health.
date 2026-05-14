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
	import {
		getMealsForDay,
		getPhaseLabel,
		getPhaseTargets,
		getTrainingDay,
		getUserName,
		greeting,
		sumMealKcal
	} from '$lib/logic/planDerive';
	import { activeDayType, persistActiveDayType, plan } from '$lib/stores/healthApp';
	import type { DayType } from '$lib/types/planV2';

	let phaseIndex = $state(0);

	const targets = $derived(getPhaseTargets($plan, phaseIndex));
	const meals = $derived(getMealsForDay($plan, $activeDayType as DayType));
	const kcalSum = $derived(sumMealKcal(meals));

	const pVal = $derived(Math.min(targets.protein, Math.round(targets.protein * 0.88)));
	const cVal = $derived(Math.min(targets.carbs, Math.round(targets.carbs * 0.82)));
	const fVal = $derived(Math.min(targets.fat, Math.round(targets.fat * 0.9)));

	const waterL = $derived(1.6);
	const waterTarget = 3;
	const calProg = $derived(targets.kcal > 0 ? Math.min(1, kcalSum / targets.kcal) : 0);

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
			<MetricRing value={pVal} max={Math.max(1, targets.protein)} unit="g" label="Protein" />
			<MetricRing value={cVal} max={Math.max(1, targets.carbs)} unit="g" label="Carbs" />
			<MetricRing value={fVal} max={Math.max(1, targets.fat)} unit="g" label="Fat" />
		</div>

		<div class="tiles">
			<MetricTile
				label="WATER"
				value={`${waterL.toFixed(1)} / ${waterTarget.toFixed(1)} L`}
				subvalue={`${Math.round((waterL / waterTarget) * 100)}%`}
				progress={waterL / waterTarget}
			/>
			<MetricTile
				label="CALORIES"
				value={kcalSum > 0 ? `${kcalSum.toLocaleString()}` : '—'}
				subvalue={targets.kcal > 0 ? `/ ${targets.kcal.toLocaleString()} kcal` : ''}
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
</style>
