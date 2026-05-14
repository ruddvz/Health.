<script lang="ts">
	import DotHeading from '$lib/components/nothing/DotHeading.svelte';
	import NothingWidget from '$lib/components/nothing/NothingWidget.svelte';
</script>

<div class="screen px-screen pt-safe stack">
	<DotHeading text="Progress_" />
	<NothingWidget
		eyebrow="Signal check"
		title="Trends & adherence"
		value="—"
		meta="Weight, waist, flags (Phase 6)."
	/>
</div>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
