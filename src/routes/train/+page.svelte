<script lang="ts">
	import DotHeading from '$lib/components/nothing/DotHeading.svelte';
	import NothingWidget from '$lib/components/nothing/NothingWidget.svelte';
</script>

<div class="screen px-screen pt-safe stack">
	<DotHeading text="Train_" />
	<NothingWidget
		eyebrow="Session"
		title="Workout mode"
		value="—"
		meta="Set logging and rest timer (Phase 5)."
	/>
</div>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
