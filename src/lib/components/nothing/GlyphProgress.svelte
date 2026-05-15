<script lang="ts">
	interface Props {
		label: string;
		value: number;
		max: number;
		segments?: number;
	}
	let { label, value, max, segments = 10 }: Props = $props();

	const filled = $derived(max <= 0 ? 0 : Math.round((Math.min(value, max) / max) * segments));
	const segmentIndexes = $derived(Array.from({ length: segments }, (_, index) => index));
</script>

<div class="glyph" aria-label="{label}: {value} of {max}">
	<span class="label mono-caps">{label}</span>
	<div class="dots" role="img">
		{#each segmentIndexes as index (index)}
			<span class:dot={true} class:filled={index < filled}></span>
		{/each}
	</div>
</div>

<style>
	.glyph {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.label {
		margin: 0;
	}

	.dots {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		align-items: center;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 1px solid var(--line-2);
		background: transparent;
	}

	.dot.filled {
		background: var(--red);
		border-color: var(--red);
	}
</style>
