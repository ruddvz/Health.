<script lang="ts">
	import { browser } from '$app/environment';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { LS_PLAN } from '$lib/constants/storage';
	import { importWarnings } from '$lib/stores/healthApp';
	import { parsePlanJsonText } from '$lib/validation/planV2';

	const diag = $derived.by(() => {
		if (!browser) return { error: null as string | null, parseWarnings: [] as string[] };
		const raw = localStorage.getItem(LS_PLAN);
		if (!raw) return { error: 'No plan in storage.', parseWarnings: [] as string[] };
		const r = parsePlanJsonText(raw);
		if (!r.ok) return { error: r.error, parseWarnings: r.warnings };
		return { error: null as string | null, parseWarnings: r.warnings };
	});

	const allWarnings = $derived([...diag.parseWarnings, ...$importWarnings]);
</script>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ScreenHeaderBlock title="DIAGNOSTICS" subtitle="Plan health" />

	{#if diag.error}
		<section class="err nothing-surface" role="status">
			<p class="mono-caps t">Error</p>
			<p class="b">{diag.error}</p>
		</section>
	{:else}
		<section class="ok nothing-surface" role="status">
			<p class="mono-caps t">Schema</p>
			<p class="b">Plan JSON parses and required sections are present.</p>
		</section>
	{/if}

	{#if allWarnings.length}
		<section class="warn nothing-surface">
			<p class="mono-caps t">Warnings</p>
			<ul>
				{#each allWarnings as w, i (i)}
					<li>{w}</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.err,
	.ok,
	.warn {
		padding: var(--space-4);
		margin-bottom: var(--space-3);
	}

	.t {
		margin: 0 0 var(--space-2);
		font-size: 10px;
		color: var(--text-3);
	}

	.b {
		margin: 0;
		font-size: 14px;
		color: var(--text-2);
		line-height: 1.5;
	}

	.err .t {
		color: var(--red);
	}

	ul {
		margin: 0;
		padding-left: 1.1rem;
		color: var(--text-2);
		font-size: 14px;
		line-height: 1.55;
	}
</style>
