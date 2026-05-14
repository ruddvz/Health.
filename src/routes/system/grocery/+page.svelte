<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import ChecklistRow from '$lib/components/spec/ChecklistRow.svelte';
	import ChipRow from '$lib/components/spec/ChipRow.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SecondaryButton from '$lib/components/spec/SecondaryButton.svelte';
	import SectionLabel from '$lib/components/spec/SectionLabel.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { flattenGrocery } from '$lib/logic/planDerive';
	import { persistProgress, plan, progress } from '$lib/stores/healthApp';
	import { get } from 'svelte/store';

	let chip = $state('All');

	const grouped = $derived.by(() => {
		const rows = flattenGrocery($plan);
		const byStore: Record<string, typeof rows> = {};
		for (const r of rows) {
			if (chip !== 'All' && chip === 'Store' && r.store !== 'SUPERMARKET') continue;
			if (chip !== 'All' && chip === 'Category') continue;
			if (!byStore[r.store]) byStore[r.store] = [];
			byStore[r.store].push(r);
		}
		return byStore;
	});

	function toggle(key: string) {
		const cur = get(progress);
		const gc = { ...(cur.groceryChecked ?? {}) };
		gc[key] = !gc[key];
		persistProgress({ ...cur, groceryChecked: gc });
	}

	function checked(key: string) {
		return !!get(progress).groceryChecked?.[key];
	}

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="GROCERY" />
		<ChipRow chips={['All', 'Store', 'Category']} selected={chip} onSelect={(c) => (chip = c)} />

		{#each Object.entries(grouped) as [store, items] (store)}
			<SectionLabel text={`STORE: ${store}`} />
			{#each items as it (it.key)}
				<ChecklistRow
					checked={checked(it.key)}
					label={it.name}
					quantity={it.qty || '—'}
					onToggle={() => toggle(it.key)}
				/>
			{/each}
		{/each}

		<SecondaryButton label="+ Add Item" onclick={() => {}} />
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
