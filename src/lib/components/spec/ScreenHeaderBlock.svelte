<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		subtitle?: string;
		right?: Snippet;
	}
	let { eyebrow, title, subtitle, right }: Props = $props();
</script>

<header class="head">
	<div class="left">
		{#if eyebrow}
			<p class="eyebrow mono-caps">{eyebrow}</p>
		{/if}
		<h1 class="title">{title}</h1>
		{#if subtitle}
			<p class="sub">{subtitle}</p>
		{/if}
	</div>
	{#if right}
		<div class="right">{@render right()}</div>
	{/if}
</header>

<style>
	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.left {
		min-width: 0;
		flex: 1;
	}

	.eyebrow {
		margin: 0 0 var(--space-1);
		color: var(--text-3);
	}

	.title {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 1.55rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		line-height: 1.15;
		text-transform: uppercase;
		color: var(--text-1);
		white-space: pre-line;
	}

	.sub {
		margin: var(--space-2) 0 0;
		font-size: 14px;
		line-height: 1.45;
		color: var(--text-2);
	}

	.right {
		flex-shrink: 0;
		padding-top: 2px;
	}
</style>
