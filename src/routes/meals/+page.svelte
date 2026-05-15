<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import ChipRow from '$lib/components/spec/ChipRow.svelte';
	import MealCard from '$lib/components/spec/MealCard.svelte';
	import QuickFixSheet from '$lib/components/spec/QuickFixSheet.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SecondaryButton from '$lib/components/spec/SecondaryButton.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import TargetGapCard from '$lib/components/spec/TargetGapCard.svelte';
	import { logicalDateKey } from '$lib/logic/dateKey';
	import { plannedMacrosFromMeals } from '$lib/logic/dayTotals';
	import { getMealSlotState, mealSlotKey } from '$lib/logic/mealSlots';
	import { newId } from '$lib/logic/id';
	import type { QuickFixPreset } from '$lib/logic/quickFixPresets';
	import { getMealsForDay, getPhaseTargets } from '$lib/logic/planDerive';
	import {
		persistActiveDayType,
		persistProgress,
		plan,
		progress,
		settings
	} from '$lib/stores/healthApp';
	import type { DayType, ExtraMeal, MealSlotStatus } from '$lib/types/planV2';
	import { get } from 'svelte/store';

	let chip = $state<'Workout Day' | 'Rest Day' | 'All'>('Workout Day');
	let quickFixOpen = $state(false);
	let addOpen = $state(false);
	let emName = $state('');
	let emTime = $state('12:00');
	let emKcal = $state('');
	let emP = $state('');
	let emC = $state('');
	let emF = $state('');

	const logDay = $derived(logicalDateKey(new Date(), $settings));
	const dayTypeForTrack = $derived<DayType | null>(
		chip === 'Rest Day' ? 'rest' : chip === 'Workout Day' ? 'workout' : null
	);

	const meals = $derived.by(() => {
		if (chip === 'All') {
			const a = getMealsForDay($plan, 'workout');
			const b = getMealsForDay($plan, 'rest');
			return [...a, ...b];
		}
		return getMealsForDay($plan, chip === 'Rest Day' ? 'rest' : 'workout');
	});

	const targets = $derived(getPhaseTargets($plan, 0));
	const planned = $derived(plannedMacrosFromMeals(meals, targets));

	const gap = $derived.by(() => {
		const d = targets.kcal - planned.kcal;
		const dp = targets.protein - planned.protein;
		const dc = targets.carbs - planned.carbs;
		if (Math.abs(d) < 80) return null;
		return {
			title: 'TARGET GAP',
			message:
				d > 0
					? 'Template meals run a little light versus phase calories.'
					: 'Template meals run a little heavy versus phase calories.',
			metrics: [
				{
					label: 'Calories',
					value: `${d > 0 ? '' : '+'}${Math.round(d)} kcal`,
					color: 'warning' as const
				},
				{
					label: 'Protein',
					value: `${dp > 0 ? '' : '+'}${Math.round(dp)} g`,
					color: 'warning' as const
				},
				{
					label: 'Carbs',
					value: `${dc > 0 ? '' : '+'}${Math.round(dc)} g`,
					color: 'warning' as const
				}
			]
		};
	});

	function setMealSlot(slot: number, dayType: DayType, s: 'pending' | MealSlotStatus) {
		const cur = get(progress);
		const k = mealSlotKey(logDay, dayType, slot);
		const nextMap = { ...(cur.mealSlotStatus ?? {}) };
		if (s === 'pending') delete nextMap[k];
		else nextMap[k] = s;
		persistProgress({ ...cur, mealSlotStatus: nextMap });
	}

	function onQuickPick(p: QuickFixPreset) {
		const cur = get(progress);
		const item = {
			id: newId(),
			day: logicalDateKey(new Date(), get(settings)),
			label: p.label,
			kcal: p.kcal,
			protein_g: p.protein_g,
			carbs_g: p.carbs_g,
			fat_g: p.fat_g
		};
		persistProgress({ ...cur, quickFixItems: [...(cur.quickFixItems ?? []), item] });
		quickFixOpen = false;
	}

	function saveExtraMeal() {
		const kcal = Number(emKcal);
		if (!Number.isFinite(kcal) || kcal <= 0) return;
		const cur = get(progress);
		const row: ExtraMeal = {
			id: newId(),
			day: logicalDateKey(new Date(), get(settings)),
			name: emName.trim() || 'Snack',
			time: emTime,
			kcal,
			protein_g: emP.trim() ? Number(emP) : undefined,
			carbs_g: emC.trim() ? Number(emC) : undefined,
			fat_g: emF.trim() ? Number(emF) : undefined
		};
		persistProgress({ ...cur, extraMeals: [...(cur.extraMeals ?? []), row] });
		addOpen = false;
		emName = '';
		emKcal = '';
		emP = '';
		emC = '';
		emF = '';
	}

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
				onCta={() => (quickFixOpen = true)}
			/>
		{/if}

		{#each meals as m, i (`${chip}-${m.slot}-${i}`)}
			<MealCard
				index={m.slot}
				time={m.time}
				name={m.name}
				kcal={m.kcal}
				protein={m.protein}
				carbs={m.carbs}
				fat={m.fat}
				track={dayTypeForTrack
					? {
							status: getMealSlotState($progress, logDay, dayTypeForTrack, m.slot),
							onChange: (nx) => setMealSlot(m.slot, dayTypeForTrack, nx)
						}
					: undefined}
			/>
		{/each}

		<SecondaryButton label="+ Add Meal" onclick={() => (addOpen = true)} />
	</main>
{/if}

<QuickFixSheet open={quickFixOpen} onClose={() => (quickFixOpen = false)} onPick={onQuickPick} />

{#if addOpen}
	<div class="modal" role="presentation">
		<button type="button" class="backdrop" aria-label="Close" onclick={() => (addOpen = false)}
		></button>
		<div class="sheet nothing-surface" role="dialog" aria-modal="true" aria-labelledby="add-h">
			<h2 id="add-h" class="mono-caps h">Add meal</h2>
			<p class="sub">Logged for today only. Does not edit your imported plan JSON.</p>
			<label class="field">
				<span class="mono-caps">Name</span>
				<input class="inp" type="text" bind:value={emName} placeholder="Post-workout shake" />
			</label>
			<label class="field">
				<span class="mono-caps">Time</span>
				<input class="inp" type="text" bind:value={emTime} placeholder="12:00" />
			</label>
			<label class="field">
				<span class="mono-caps">Calories (required)</span>
				<input class="inp" type="number" min="1" bind:value={emKcal} placeholder="320" />
			</label>
			<div class="row2">
				<label class="field">
					<span class="mono-caps">P (g)</span>
					<input class="inp" type="number" min="0" bind:value={emP} />
				</label>
				<label class="field">
					<span class="mono-caps">C (g)</span>
					<input class="inp" type="number" min="0" bind:value={emC} />
				</label>
				<label class="field">
					<span class="mono-caps">F (g)</span>
					<input class="inp" type="number" min="0" bind:value={emF} />
				</label>
			</div>
			<div class="row">
				<button type="button" class="ghost pressable" onclick={() => (addOpen = false)}
					>Cancel</button
				>
				<button type="button" class="red pressable" onclick={saveExtraMeal}>Save</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
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

	.inp {
		padding: 10px 12px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-1);
		font-size: 16px;
	}

	.row2 {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
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
