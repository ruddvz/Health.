<script lang="ts">
	import DotHeading from '$lib/components/nothing/DotHeading.svelte';
	import NothingWidget from '$lib/components/nothing/NothingWidget.svelte';
</script>

<div class="screen px-screen pt-safe stack">
	<DotHeading text="System_" />
	<NothingWidget
		eyebrow="Data"
		title="Import / export"
		value="Soon"
		meta="JSON upload, validation, diagnostics (Phase 2)."
	/>
	<NothingWidget
		eyebrow="Legacy"
		title="HTML v1 snapshot"
		value="legacy/"
		meta="Previous single-file app for reference."
	/>
</div>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
