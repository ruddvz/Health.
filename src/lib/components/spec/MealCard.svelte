<script lang="ts">
	interface Props {
		index: number;
		time: string;
		name: string;
		kcal: number;
		protein: string;
		carbs: string;
		fat: string;
		onclick?: () => void;
	}
	let { index, time, name, kcal, protein, carbs, fat, onclick }: Props = $props();
</script>

<button type="button" class="card nothing-surface pressable" {onclick}>
	<span class="mono-caps idx">{index}</span>
	<div class="body">
		<p class="mono-caps time">{time}</p>
		<p class="n">{name}</p>
		<p class="m">{kcal} kcal · P {protein} · C {carbs} · F {fat}</p>
	</div>
</button>

<style>
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
</style>
