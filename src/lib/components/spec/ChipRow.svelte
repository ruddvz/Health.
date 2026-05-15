<script lang="ts">
	interface Props {
		chips: string[];
		selected: string;
		onSelect?: (label: string) => void;
	}
	let { chips, selected, onSelect }: Props = $props();
</script>

<div class="row" role="tablist">
	{#each chips as c (c)}
		<button
			type="button"
			class="chip pressable"
			class:on={selected === c}
			aria-selected={selected === c}
			role="tab"
			onclick={() => onSelect?.(c)}
		>
			{c}
		</button>
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.chip {
		border: 1px solid var(--line-1);
		background: var(--surface-1);
		color: var(--text-2);
		font-size: 12px;
		font-weight: 600;
		padding: 8px 12px;
		border-radius: 999px;
		cursor: pointer;
	}

	.chip.on {
		border-color: var(--red-line);
		color: var(--red);
		background: var(--red-soft);
	}
</style>
