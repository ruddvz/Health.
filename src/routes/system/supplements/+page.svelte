<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import ChipRow from '$lib/components/spec/ChipRow.svelte';
	import ScheduleRow from '$lib/components/spec/ScheduleRow.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SectionLabel from '$lib/components/spec/SectionLabel.svelte';
	import SupplementCard from '$lib/components/spec/SupplementCard.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { getSupplementSchedule } from '$lib/logic/planDerive';
	import { persistProgress, plan, progress } from '$lib/stores/healthApp';
	import { get } from 'svelte/store';

	let chip = $state('All');
	const sched = $derived(getSupplementSchedule($plan));
	const stack = $derived.by(() => {
		const sup = ($plan?.supplements ?? {}) as Record<string, unknown>;
		const s = sup.stack;
		return Array.isArray(s) ? s : [];
	});

	function checked(key: string) {
		return !!get(progress).suppChecked?.[key];
	}

	function toggle(key: string) {
		const cur = get(progress);
		const sc = { ...(cur.suppChecked ?? {}) };
		sc[key] = !sc[key];
		persistProgress({ ...cur, suppChecked: sc });
	}

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="SUPPLEMENTS" />

		<SectionLabel text="TODAY'S SCHEDULE" />
		{#each sched as row (row.key)}
			<ScheduleRow
				time={row.time}
				title={row.title}
				subtitle={row.subtitle}
				checked={checked(row.key)}
				onToggle={() => toggle(row.key)}
			/>
		{/each}

		<SectionLabel text="ALL SUPPLEMENTS" />
		<ChipRow
			chips={['All', 'Performance', 'Health', 'Other']}
			selected={chip}
			onSelect={(c) => (chip = c)}
		/>

		{#each stack as item, i (i)}
			{@const it = (item || {}) as Record<string, unknown>}
			<SupplementCard
				title={String(it.name ?? it.title ?? 'Supplement')}
				subtitle={String(it.timing ?? it.dose ?? 'See label')}
				tag="Daily"
			/>
		{/each}

		<p class="disclaimer">
			Supplements <strong>may</strong> support goals for some people. Evidence varies. Always read the
			label and consult a professional if you are pregnant, on medication, or have a medical condition.
		</p>
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.disclaimer {
		font-size: 12px;
		line-height: 1.55;
		color: var(--text-3);
		margin-top: var(--space-4);
	}
</style>
