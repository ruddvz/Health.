<script lang="ts">
	type SlotState = 'pending' | 'logged' | 'skipped';

	interface TrackProps {
		status: SlotState;
		onChange: (next: SlotState) => void;
	}

	interface Props {
		index: number;
		time: string;
		name: string;
		kcal: number;
		protein: string;
		carbs: string;
		fat: string;
		track?: TrackProps;
		onclick?: () => void;
	}
	let { index, time, name, kcal, protein, carbs, fat, track, onclick }: Props = $props();
</script>

{#if track}
	<div class="wrap nothing-surface">
		<div class="row-main">
			<span class="mono-caps idx">{index}</span>
			<div class="body">
				<p class="mono-caps time">{time}</p>
				<p class="n">{name}</p>
				<p class="m">{kcal} kcal · P {protein} · C {carbs} · F {fat}</p>
			</div>
		</div>
		<div class="track" role="group" aria-label="Meal intake for this slot">
			<button
				type="button"
				class="tb pressable"
				data-on={track.status === 'logged'}
				onclick={() => track.onChange('logged')}
			>
				Log
			</button>
			<button
				type="button"
				class="tb pressable"
				data-on={track.status === 'skipped'}
				onclick={() => track.onChange('skipped')}
			>
				Skip
			</button>
			<button type="button" class="tb ghost pressable" onclick={() => track.onChange('pending')}
				>Reset</button
			>
		</div>
	</div>
{:else}
	<button type="button" class="card nothing-surface pressable" {onclick}>
		<span class="mono-caps idx">{index}</span>
		<div class="body">
			<p class="mono-caps time">{time}</p>
			<p class="n">{name}</p>
			<p class="m">{kcal} kcal · P {protein} · C {carbs} · F {fat}</p>
		</div>
	</button>
{/if}

<style>
	.wrap {
		width: 100%;
		margin-bottom: var(--space-2);
		padding: var(--space-3) var(--space-4);
	}

	.row-main {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
	}

	.card {
		display: flex;
		gap: var(--space-3);
		width: 100%;
		min-height: 86px;
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-2);
		text-align: left;
		cursor: pointer;
	}

	.idx {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 6px;
		background: var(--surface-3);
		color: var(--text-3);
		font-size: 9px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.body {
		flex: 1;
		min-width: 0;
	}

	.time {
		margin: 0;
		font-size: 9px;
		color: var(--text-3);
	}

	.n {
		margin: 4px 0 0;
		font-size: 16px;
		font-weight: 650;
		color: var(--text-1);
	}

	.m {
		margin: 6px 0 0;
		font-size: 12px;
		color: var(--text-2);
		line-height: 1.35;
	}

	.track {
		display: flex;
		gap: 8px;
		margin-top: var(--space-3);
	}

	.tb {
		flex: 1;
		min-height: 36px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-2);
		font-size: 11px;
		font-weight: 650;
		cursor: pointer;
	}

	.tb[data-on='true'] {
		border-color: var(--red-line);
		color: var(--text-1);
		box-shadow: inset 0 0 0 1px rgba(255, 42, 42, 0.25);
	}

	.tb.ghost {
		flex: 0.6;
		opacity: 0.85;
	}
</style>
