<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import ChipRow from '$lib/components/spec/ChipRow.svelte';
	import MealCard from '$lib/components/spec/MealCard.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SecondaryButton from '$lib/components/spec/SecondaryButton.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import TargetGapCard from '$lib/components/spec/TargetGapCard.svelte';
	import { getMealsForDay, getPhaseTargets, sumMealKcal } from '$lib/logic/planDerive';
	import { persistActiveDayType, plan } from '$lib/stores/healthApp';

	let chip = $state<'Workout Day' | 'Rest Day' | 'All'>('Workout Day');

	const meals = $derived.by(() => {
		if (chip === 'All') {
			const a = getMealsForDay($plan, 'workout');
			const b = getMealsForDay($plan, 'rest');
			return [...a, ...b];
		}
		return getMealsForDay($plan, chip === 'Rest Day' ? 'rest' : 'workout');
	});

	const targets = $derived(getPhaseTargets($plan, 0));
	const kcalSum = $derived(sumMealKcal(meals));

	const gap = $derived.by(() => {
		const d = targets.kcal - kcalSum;
		if (Math.abs(d) < 80) return null;
		return {
			title: 'TARGET GAP',
			message:
				d > 0
					? 'You are slightly under on calories for this template.'
					: 'You are slightly over on calories for this template.',
			metrics: [
				{
					label: 'Calories',
					value: `${d > 0 ? '' : '+'}${Math.round(d)} kcal`,
					color: 'warning' as const
				},
				{ label: 'Protein', value: '—', color: 'text' as const },
				{ label: 'Carbs', value: '—', color: 'text' as const }
			]
		};
	});

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});

	$effect(() => {
		if (chip === 'Workout Day') persistActiveDayType('workout');
		else if (chip === 'Rest Day') persistActiveDayType('rest');
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="MEALS" />

		<ChipRow
			chips={['Workout Day', 'Rest Day', 'All']}
			selected={chip}
			onSelect={(c) => (chip = c as typeof chip)}
		/>

		{#if gap}
			<TargetGapCard
				title={gap.title}
				message={gap.message}
				metrics={gap.metrics}
				cta="Quick Fix"
				onCta={() => {}}
			/>
		{/if}

		{#each meals as m, i (m.slot + '-' + i)}
			<MealCard
				index={m.slot}
				time={m.time}
				name={m.name}
				kcal={m.kcal}
				protein={m.protein}
				carbs={m.carbs}
				fat={m.fat}
				onclick={() => {}}
			/>
		{/each}

		<SecondaryButton label="+ Add Meal" onclick={() => {}} />
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
