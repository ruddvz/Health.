<script lang="ts">
	import DotHeading from '$lib/components/nothing/DotHeading.svelte';
	import NothingWidget from '$lib/components/nothing/NothingWidget.svelte';
</script>

<div class="screen px-screen pt-safe stack">
	<DotHeading text="Meals_" />
	<NothingWidget
		eyebrow="Control panel"
		title="Meal timeline"
		value="—"
		meta="Loads from your plan JSON (Phase 4)."
	/>
</div>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
