<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
	}
	let { label, type = 'button', disabled = false, onclick, children }: Props = $props();
</script>

<button class="btn pressable" {type} {disabled} {onclick}>
	<span class="label">{label}</span>
	{#if children}
		<span class="slot">{@render children()}</span>
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-4) var(--space-5);
		border: 1px solid var(--red);
		border-radius: var(--radius-sm);
		background: var(--red);
		color: #0b0b0b;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.btn:not(:disabled):active {
		background: #e02020;
		border-color: #e02020;
	}

	.label {
		pointer-events: none;
	}

	.slot {
		font-size: 14px;
		line-height: 1;
		opacity: 0.85;
	}
</style>
