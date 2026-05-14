<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DotHeading from '$lib/components/nothing/DotHeading.svelte';
	import NothingWidget from '$lib/components/nothing/NothingWidget.svelte';
	import GlyphProgress from '$lib/components/nothing/GlyphProgress.svelte';
	import RedActionButton from '$lib/components/nothing/RedActionButton.svelte';

	function goSystem() {
		goto(resolve('/system'));
	}
</script>

<div class="screen px-screen pt-safe">
	<DotHeading text="Today_" />

	<section class="stack" aria-label="Dashboard preview">
		<NothingWidget
			eyebrow="Next signal"
			title="No plan loaded"
			value="—"
			meta="Import JSON from System when Phase 2 ships."
			actionLabel="Go to system"
		/>
		<RedActionButton label="Upload plan" onclick={goSystem} />
		<div class="grid-2">
			<NothingWidget
				eyebrow="Nutrition"
				title="Protein"
				value="—"
				meta="Target pending"
				progress={0}
			/>
			<NothingWidget
				eyebrow="Energy"
				title="Calories"
				value="—"
				meta="Target pending"
				progress={0}
			/>
		</div>
		<div class="glyph-card nothing-surface">
			<GlyphProgress label="Protein (preview)" value={0} max={175} segments={10} />
		</div>
	</section>
</div>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.glyph-card {
		padding: var(--space-4);
	}
</style>
