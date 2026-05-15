<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import AdherenceCard from '$lib/components/spec/AdherenceCard.svelte';
	import ChartCard from '$lib/components/spec/ChartCard.svelte';
	import CheckinCard from '$lib/components/spec/CheckinCard.svelte';
	import ChipRow from '$lib/components/spec/ChipRow.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { plan } from '$lib/stores/healthApp';

	let chip = $state('Overview');

	$effect(() => {
		if (!browser) return;
		if (!$plan) goto(resolve('/import'));
	});
</script>

{#if $plan}
	<main class="screen px-screen pt-safe stack">
		<StatusStrip />
		<ScreenHeaderBlock title="PROGRESS" />

		<ChipRow
			chips={['Overview', 'Trends', 'Metrics']}
			selected={chip}
			onSelect={(c) => (chip = c)}
		/>

		<ChartCard
			title="WEIGHT TREND"
			value="75.4 kg"
			delta="-0.6 kg vs last week"
			labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
		/>

		<AdherenceCard
			title="ADHERENCE"
			value="92%"
			subtitle="7 day average"
			bars={[0.7, 0.9, 0.8, 1.0, 0.95, 0.85, 0.75]}
		/>

		<CheckinCard
			title="WEEKLY CHECK-IN"
			question="How was your week?"
			subtitle="Log your energy, sleep & notes."
			cta="Log Check-in"
			onclick={() => {}}
		/>
	</main>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
