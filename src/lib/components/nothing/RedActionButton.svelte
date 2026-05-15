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

<button class="btn" {type} {disabled} {onclick}>
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
		min-height: 52px;
		padding: var(--space-3) var(--space-5);
		border: 1px solid var(--red);
		border-radius: var(--radius-sm);
		background: var(--red);
		color: #ffffff;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		cursor: pointer;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.18),
			var(--shadow-red-glow);
	}

	.btn:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		background: #3a1a1a;
		border-color: #3a1a1a;
		color: var(--text-3);
	}

	.btn:not(:disabled):hover {
		background: var(--red-hover);
		border-color: var(--red-hover);
	}

	.btn:not(:disabled):active {
		background: var(--red-pressed);
		border-color: var(--red-pressed);
		transform: scale(0.985);
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
