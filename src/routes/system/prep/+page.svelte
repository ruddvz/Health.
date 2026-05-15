<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import PrepStepCard from '$lib/components/spec/PrepStepCard.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SectionTitleBlock from '$lib/components/spec/SectionTitleBlock.svelte';
	import TipCard from '$lib/components/spec/TipCard.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { getPrepSteps } from '$lib/logic/planDerive';
	import { persistProgress, plan, progress } from '$lib/stores/healthApp';
	import { get } from 'svelte/store';

	const steps = $derived(getPrepSteps($plan));
	const pg = $derived(($plan?.prep_guide ?? {}) as Record<string, unknown>);
	const totalMin = $derived(typeof pg.total_minutes === 'number' ? pg.total_minutes : 0);

	function checked(key: string) {
		return !!get(progress).prepChecked?.[key];
	}

	function toggle(key: string) {
		const cur = get(progress);
		const pc = { ...(cur.prepChecked ?? {}) };
		pc[key] = !pc[key];
		persistProgress({ ...cur, prepChecked: pc });
	}

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="PREP" />
		<SectionTitleBlock
			title="SUNDAY PREP"
			subtitle={`Estimated time: ${totalMin || '—'} min`}
			subtitleColor="red"
		/>

		{#each steps as s (s.key)}
			<PrepStepCard
				title={s.title}
				subtitle={s.subtitle || ' '}
				time={`${s.minutes}m`}
				checked={checked(s.key)}
				onToggle={() => toggle(s.key)}
			/>
		{/each}

		<TipCard
			title="Prep Tip"
			body={(Array.isArray(pg.tips) && pg.tips[0] && typeof pg.tips[0] === 'string'
				? pg.tips[0]
				: 'Batch cooking saves time and keeps you consistent.') + ''}
		/>
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
