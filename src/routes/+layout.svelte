<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import '$lib/styles/global.css';
	import '$lib/styles/nothing.css';
	import '$lib/styles/utilities.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppShell from '$lib/components/app/AppShell.svelte';
	import TopStatusBar from '$lib/components/app/TopStatusBar.svelte';
	import InstallPrompt from '$lib/components/app/InstallPrompt.svelte';
	import { normalizePathname } from '$lib/paths';
	import { activeDayType, hydrateFromLocalStorage, plan } from '$lib/stores/healthApp';

	let { children } = $props();

	onMount(() => {
		hydrateFromLocalStorage();
	});

	const path = $derived(normalizePathname(page.url.pathname));
	const showNav = $derived(path !== '/' && path !== '/import');

	const weekLabel = $derived.by(() => {
		const p = $plan;
		const phases = p?.phases;
		if (Array.isArray(phases) && phases[0]) {
			const ph = phases[0] as Record<string, unknown>;
			const w = ph.weeks;
			return typeof w === 'string' ? `WEEK ${w}` : 'WEEK 01';
		}
		return 'WEEK —';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={`${base}/icons/icon-192.png`} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="theme-color" content="#0b0b0b" />
	<meta
		name="description"
		content="Personal health plan from your JSON — training, meals, grocery, and progress on your device."
	/>
	<title>HEALTH — Personal Plan</title>
</svelte:head>

{#if showNav}
	<TopStatusBar {weekLabel} dayMode={$activeDayType} />
{/if}
<AppShell {showNav}>
	{@render children()}
</AppShell>
<InstallPrompt />
