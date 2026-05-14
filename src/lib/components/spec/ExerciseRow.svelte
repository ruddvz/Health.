<script lang="ts">
	interface Props {
		index: number;
		name: string;
		setsReps: string;
		rest: string;
	}
	let { index, name, setsReps, rest }: Props = $props();
</script>

<div class="row nothing-surface-2">
	<span class="mono-caps idx">{index}</span>
	<div class="mid">
		<p class="n">{name}</p>
		<p class="s">{setsReps}</p>
	</div>
	<p class="mono-caps r">{rest}</p>
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 58px;
		padding: var(--space-2) var(--space-3);
		margin-bottom: var(--space-2);
	}

	.idx {
		width: 22px;
		text-align: center;
		color: var(--text-3);
		font-size: 9px;
		flex-shrink: 0;
	}

	.mid {
		flex: 1;
		min-width: 0;
	}

	.n {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: var(--text-1);
	}

	.s {
		margin: 4px 0 0;
		font-size: 12px;
		color: var(--text-2);
	}

	.r {
		margin: 0;
		font-size: 9px;
		color: var(--text-3);
		flex-shrink: 0;
	}
</style>
