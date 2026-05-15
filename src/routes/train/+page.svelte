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
	import { liftStatsFromSessions, recentSessions } from '$lib/logic/workoutHistory';
	import { plan, progress } from '$lib/stores/healthApp';

	const day = $derived(getTrainingDay($plan, 0));
	const exercises = $derived.by(() => {
		const ex = day?.exercises;
		return Array.isArray(ex) ? ex : [];
	});

	const sessions = $derived(recentSessions($progress, 5));
	const liftStats = $derived(liftStatsFromSessions(recentSessions($progress, 12)));

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

			<SectionLabel text="RECENT SESSIONS" />
			{#if sessions.length === 0}
				<p class="empty">Finish a workout session to see it listed here.</p>
			{:else}
				<ul class="list nothing-surface">
					{#each sessions as s (s.id)}
						<li class="row">
							<p class="mono-caps t">{fmtShort(s.finishedAt)}</p>
							<p class="b">{s.exercises.length} exercises</p>
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
</style>
