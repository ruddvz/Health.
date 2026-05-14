<script lang="ts">
	import { base } from '$app/paths';
	import '$lib/styles/global.css';
	import '$lib/styles/nothing.css';
	import '$lib/styles/utilities.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppShell from '$lib/components/app/AppShell.svelte';
	import TopStatusBar from '$lib/components/app/TopStatusBar.svelte';
	import OfflineBanner from '$lib/components/app/OfflineBanner.svelte';
	import InstallPrompt from '$lib/components/app/InstallPrompt.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={`${base}/icons/icon-192.png`} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="theme-color" content="#0b0b0b" />
	<meta
		name="description"
		content="Private offline health plan companion. Local only — no server."
	/>
	<title>Health — Personal Plan</title>
</svelte:head>

<TopStatusBar weekLabel="WEEK 01" dayMode="workout" />
<OfflineBanner />
<AppShell>
	{@render children()}
</AppShell>
<InstallPrompt />
