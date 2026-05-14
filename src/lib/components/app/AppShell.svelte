<script lang="ts">
	import BottomNav from './BottomNav.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		showNav?: boolean;
	}
	let { children, showNav = true }: Props = $props();
</script>

<div class="shell">
	<div class="content" class:pb-nav={showNav} class:pb-min={!showNav}>
		{@render children()}
	</div>
	{#if showNav}
		<BottomNav />
	{/if}
</div>

<style>
	.shell {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.pb-nav {
		padding-bottom: calc(var(--nav-h) + var(--safe-bottom) + var(--space-6));
	}

	.pb-min {
		padding-bottom: calc(var(--space-6) + var(--safe-bottom));
	}
</style>
