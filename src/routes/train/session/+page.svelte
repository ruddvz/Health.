<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { getTrainingDay } from '$lib/logic/planDerive';
	import { plan } from '$lib/stores/healthApp';

	const day = $derived(getTrainingDay($plan, 0));
	const exercises = $derived.by(() => {
		const ex = day?.exercises;
		return Array.isArray(ex) ? ex : [];
	});
	let idx = $state(0);

	const current = $derived(exercises[idx] as Record<string, unknown> | undefined);

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="SESSION" subtitle={String(day?.name ?? 'Workout')} />

		{#if current}
			<section class="panel nothing-surface">
				<p class="mono-caps step">Exercise {idx + 1} / {exercises.length}</p>
				<h2 class="name">{String(current.name)}</h2>
				<p class="meta">
					{String(current.sets ?? '—')} sets × {String(current.reps ?? '—')} reps · Rest {String(
						current.rest_seconds ?? '—'
					)}s
				</p>
				<label class="field">
					<span class="mono-caps">Weight (kg)</span>
					<input class="inp" type="text" placeholder="e.g. 60" />
				</label>
				<label class="field">
					<span class="mono-caps">Reps</span>
					<input class="inp" type="text" placeholder="e.g. 8" />
				</label>
				<div class="row">
					<button type="button" class="ghost pressable" onclick={() => goto(resolve('/train'))}
						>End</button
					>
					<button
						type="button"
						class="red pressable"
						onclick={() => {
							if (idx < exercises.length - 1) idx += 1;
							else goto(resolve('/train'));
						}}
					>
						{idx < exercises.length - 1 ? 'Next' : 'Finish'}
					</button>
				</div>
			</section>
		{:else}
			<p class="empty">No exercises in plan.</p>
		{/if}
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.panel {
		padding: var(--space-4);
	}

	.step {
		margin: 0 0 var(--space-2);
		color: var(--text-3);
		font-size: 9px;
	}

	.name {
		margin: 0;
		font-size: 20px;
		font-weight: 650;
		color: var(--text-1);
	}

	.meta {
		margin: var(--space-2) 0 var(--space-4);
		font-size: 14px;
		color: var(--text-2);
		line-height: 1.45;
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
		font-size: 16px;
	}

	.row {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-4);
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

	.empty {
		color: var(--text-2);
	}
</style>
