<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { newId } from '$lib/logic/id';
	import { getTrainingDay } from '$lib/logic/planDerive';
	import { persistProgress, plan, progress } from '$lib/stores/healthApp';
	import type {
		ActiveWorkout,
		WorkoutExerciseLog,
		WorkoutSessionLog,
		WorkoutSetEntry
	} from '$lib/types/planV2';
	import { get } from 'svelte/store';

	const day = $derived(getTrainingDay($plan, 0));
	const exercises = $derived.by(() => {
		const ex = day?.exercises;
		return Array.isArray(ex) ? ex : [];
	});

	let idx = $state(0);

	const aw = $derived($progress.activeWorkout);
	const current = $derived(aw?.exercises[idx]);

	function setCount(ex: Record<string, unknown>): number {
		const s = ex.sets;
		if (typeof s === 'number' && s > 0) return Math.min(12, Math.floor(s));
		if (typeof s === 'string') {
			const n = parseInt(s, 10);
			if (Number.isFinite(n) && n > 0) return Math.min(12, n);
		}
		return 3;
	}

	function buildActiveFromPlan(): ActiveWorkout {
		const startedAt = new Date().toISOString();
		const exLogs: WorkoutExerciseLog[] = exercises.map((ex) => {
			const row = ex as Record<string, unknown>;
			const name = String(row.name ?? 'Exercise');
			const n = setCount(row);
			const sets: WorkoutSetEntry[] = Array.from({ length: n }, () => ({
				weight_kg: '',
				reps: '',
				done: false
			}));
			return { name, sets };
		});
		return { dayIndex: 0, startedAt, exerciseIndex: 0, exercises: exLogs };
	}

	function ensureSession() {
		const p = get(plan);
		if (!p) return;
		const cur = get(progress);
		const existing = cur.activeWorkout;
		const sameShape =
			existing &&
			existing.exercises.length === exercises.length &&
			existing.exercises.every((e, i) => {
				const nm = String((exercises[i] as Record<string, unknown>).name ?? '');
				return e.name === nm;
			});
		if (sameShape) {
			idx = Math.min(existing.exerciseIndex, exercises.length - 1);
			return;
		}
		if (!exercises.length) return;
		persistProgress({ ...cur, activeWorkout: buildActiveFromPlan() });
		idx = 0;
	}

	function updateSet(si: number, patch: Partial<WorkoutSetEntry>) {
		const cur = get(progress);
		const w = cur.activeWorkout;
		if (!w) return;
		const next: ActiveWorkout = JSON.parse(JSON.stringify(w)) as ActiveWorkout;
		const row = next.exercises[idx]?.sets[si];
		if (!row) return;
		Object.assign(row, patch);
		next.exerciseIndex = idx;
		persistProgress({ ...cur, activeWorkout: next });
	}

	function goNext() {
		const cur = get(progress);
		const w = cur.activeWorkout;
		if (!w) return;
		if (idx < exercises.length - 1) {
			const nextIdx = idx + 1;
			const nextAw: ActiveWorkout = { ...w, exerciseIndex: nextIdx };
			persistProgress({ ...cur, activeWorkout: nextAw });
			idx = nextIdx;
		} else {
			finishSession();
		}
	}

	function finishSession() {
		const cur = get(progress);
		const w = cur.activeWorkout;
		if (!w) return;
		const log: WorkoutSessionLog = {
			id: newId(),
			dayIndex: w.dayIndex,
			startedAt: w.startedAt,
			finishedAt: new Date().toISOString(),
			exercises: w.exercises
		};
		const hist = [...(cur.workoutSessions ?? []), log].slice(-48);
		persistProgress({ ...cur, workoutSessions: hist, activeWorkout: undefined });
		goto(resolve('/train'));
	}

	function endWithoutSave() {
		const cur = get(progress);
		persistProgress({ ...cur, activeWorkout: undefined });
		goto(resolve('/train'));
	}

	$effect(() => {
		if (!browser) return;
		if (!$plan) {
			goto(resolve('/import'));
			return;
		}
		void exercises.length;
		ensureSession();
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="SESSION" subtitle={String(day?.name ?? 'Workout')} />

		{#if current}
			<section class="panel nothing-surface">
				<p class="mono-caps step">Exercise {idx + 1} / {exercises.length}</p>
				<h2 class="name">{current.name}</h2>
				<p class="meta">
					{String((exercises[idx] as Record<string, unknown>).sets ?? '—')} target sets · Rest {String(
						(exercises[idx] as Record<string, unknown>).rest_seconds ?? '—'
					)}s
				</p>

				<div class="sets">
					{#each current.sets as s, si (si)}
						<div class="set-row">
							<p class="mono-caps set-lab">Set {si + 1}</p>
							<label class="field">
								<span class="mono-caps">Weight (kg)</span>
								<input
									class="inp"
									type="text"
									inputmode="decimal"
									placeholder="e.g. 60"
									value={s.weight_kg ?? ''}
									oninput={(e) =>
										updateSet(si, { weight_kg: (e.target as HTMLInputElement).value })}
								/>
							</label>
							<label class="field">
								<span class="mono-caps">Reps</span>
								<input
									class="inp"
									type="text"
									inputmode="numeric"
									placeholder="e.g. 8"
									value={s.reps ?? ''}
									oninput={(e) => updateSet(si, { reps: (e.target as HTMLInputElement).value })}
								/>
							</label>
							<label class="check">
								<input
									type="checkbox"
									checked={s.done === true}
									onchange={(e) => updateSet(si, { done: (e.target as HTMLInputElement).checked })}
								/>
								<span class="mono-caps">Done</span>
							</label>
						</div>
					{/each}
				</div>

				<div class="row">
					<button type="button" class="ghost pressable" onclick={endWithoutSave}>End</button>
					<button type="button" class="red pressable" onclick={goNext}>
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

	.sets {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.set-row {
		padding: var(--space-3);
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.25);
	}

	.set-lab {
		margin: 0 0 var(--space-2);
		font-size: 9px;
		color: var(--text-3);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: var(--space-2);
	}

	.inp {
		padding: 10px 12px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-1);
		font-size: 16px;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: var(--space-1);
		font-size: 12px;
		color: var(--text-2);
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
