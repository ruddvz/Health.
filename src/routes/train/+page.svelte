<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import ExerciseRow from '$lib/components/spec/ExerciseRow.svelte';
	import RedActionButton from '$lib/components/nothing/RedActionButton.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SectionLabel from '$lib/components/spec/SectionLabel.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import WorkoutHeroCard from '$lib/components/spec/WorkoutHeroCard.svelte';
	import { getTrainingDay } from '$lib/logic/planDerive';
	import { plan } from '$lib/stores/healthApp';

	const day = $derived(getTrainingDay($plan, 0));
	const exercises = $derived.by(() => {
		const ex = day?.exercises;
		return Array.isArray(ex) ? ex : [];
	});

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="TRAIN" />

		{#if day}
			<WorkoutHeroCard
				title={String(day.name ?? 'WORKOUT').toUpperCase()}
				tag="Strength"
				duration={`${typeof day.duration_minutes === 'number' ? day.duration_minutes : 60} min`}
				description={typeof day.name === 'string'
					? `Session: ${day.name}`
					: 'Training session from your plan.'}
			/>

			<SectionLabel text="EXERCISES" rightText={`${exercises.length} exercises`} />

			{#each exercises as ex, i (i)}
				{@const e = ex as Record<string, unknown>}
				<ExerciseRow
					index={i + 1}
					name={String(e.name ?? 'Exercise')}
					setsReps={`${e.sets ?? '?'} sets × ${e.reps ?? '?'} reps`}
					rest={`${e.rest_seconds ?? '—'}s`}
				/>
			{/each}

			<RedActionButton label="Start Session" onclick={() => goto(resolve('/train/session'))} />
		{:else}
			<p class="empty">No training day found in your plan JSON.</p>
		{/if}
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.empty {
		color: var(--text-2);
		font-size: 15px;
		line-height: 1.5;
	}
</style>
