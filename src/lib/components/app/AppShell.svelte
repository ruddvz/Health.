<script lang="ts">
	import BottomNav from './BottomNav.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<div class="shell">
	<div class="content pb-nav">
		{@render children()}
	</div>
	<BottomNav />
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
</style>
