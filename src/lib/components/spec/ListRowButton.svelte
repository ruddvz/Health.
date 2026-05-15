<script lang="ts">
	interface Props {
		label: string;
		chevron?: boolean;
		onclick?: () => void;
	}
	let { label, chevron = false, onclick }: Props = $props();
</script>

<button type="button" class="row pressable" {onclick}>
	<span class="mono-caps ico" aria-hidden="true">◇</span>
	<span class="lab">{label}</span>
	{#if chevron}
		<span class="chev" aria-hidden="true">›</span>
	{/if}
</button>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		min-height: 58px;
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-2);
		border-radius: var(--radius-md);
		border: 1px solid var(--line-1);
		background: var(--surface-1);
		color: var(--text-1);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		text-align: left;
	}

	.ico {
		color: var(--text-3);
		font-size: 10px;
	}

	.lab {
		flex: 1;
	}

	.chev {
		color: var(--text-3);
		font-size: 18px;
	}
</style>
