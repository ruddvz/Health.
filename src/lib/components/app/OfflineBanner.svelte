<script lang="ts">
	import { browser } from '$app/environment';

	let online = $state(browser ? navigator.onLine : true);

	function onOnline() {
		online = true;
	}
	function onOffline() {
		online = false;
	}
</script>

<svelte:window ononline={onOnline} onoffline={onOffline} />

{#if !online}
	<div class="banner mono-caps" role="alert">Network offline — plan data stays on device</div>
{/if}

<style>
	.banner {
		margin: 0;
		padding: var(--space-2) var(--space-4);
		text-align: center;
		background: var(--warning);
		color: #0b0b0b;
		font-size: 10px;
		letter-spacing: 0.12em;
	}
</style>
