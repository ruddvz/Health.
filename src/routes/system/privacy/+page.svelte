<script lang="ts">
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
</script>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ScreenHeaderBlock title="PRIVACY" subtitle="100% local by design" />

	<section class="block nothing-surface">
		<h2 class="mono-caps h">Private</h2>
		<p class="p">
			Nothing in your plan is uploaded to HEALTH servers — there are no HEALTH servers for plan
			content.
		</p>

		<h2 class="mono-caps h">Offline</h2>
		<p class="p">
			After the shell caches, you can read your last imported plan without network access.
		</p>

		<h2 class="mono-caps h">Personal</h2>
		<p class="p">
			You control exports and deletion from Settings. Prefer device passcode and encrypted backups
			for sensitive data.
		</p>
	</section>
</main>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.block {
		padding: var(--space-4);
	}

	.h {
		margin: var(--space-4) 0 var(--space-2);
		font-size: 10px;
		color: var(--text-3);
	}

	.h:first-child {
		margin-top: 0;
	}

	.p {
		margin: 0;
		font-size: 15px;
		line-height: 1.55;
		color: var(--text-2);
	}
</style>
