<script lang="ts">
	interface Props {
		text: string;
		rightText?: string;
	}
	let { text, rightText }: Props = $props();
</script>

<div class="row">
	<p class="mono-caps t">{text}</p>
	{#if rightText}
		<p class="mono-caps r">{rightText}</p>
	{/if}
</div>

<style>
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
		margin: var(--space-2) 0 var(--space-3);
		min-height: 18px;
	}

	.t,
	.r {
		margin: 0;
		font-size: 10px;
		color: var(--text-2);
	}

	.r {
		color: var(--text-3);
	}
</style>
