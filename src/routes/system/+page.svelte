<script lang="ts">
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import SectionLabel from '$lib/components/spec/SectionLabel.svelte';
	import SettingsRowLink from '$lib/components/spec/SettingsRowLink.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
</script>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ScreenHeaderBlock title="SYSTEM" />

	<SectionLabel text="PRIVACY & DATA" />
	<SettingsRowLink
		icon="LOCK"
		title="100% Local"
		subtitle="Everything is stored on this device."
		href="/system/privacy"
	/>
	<SettingsRowLink
		icon="OUT"
		title="Export Plan"
		subtitle="Save a backup of your plan."
		href="/system/settings"
	/>
	<SettingsRowLink
		icon="DEL"
		title="Delete Local Data"
		subtitle="Remove all app data permanently."
		tone="danger"
		href="/system/settings"
	/>

	<SectionLabel text="APP" />
	<SettingsRowLink
		icon="OFF"
		title="Offline Ready"
		subtitle="Works fully without internet."
		href="/system/settings"
	/>
	<SettingsRowLink
		icon="DX"
		title="Plan Diagnostics"
		subtitle="Check plan health & issues."
		href="/system/diagnostics"
	/>
	<SettingsRowLink
		icon="i"
		title="About"
		subtitle="Version 1.0.0 • Up to date."
		href="/system/settings"
	/>

	<SectionLabel text="TOOLS" />
	<SettingsRowLink icon="CART" title="Grocery" subtitle="Store checklist" href="/system/grocery" />
	<SettingsRowLink icon="PREP" title="Prep" subtitle="Weekly prep steps" href="/system/prep" />
	<SettingsRowLink
		icon="PILL"
		title="Supplements"
		subtitle="Schedule & stack"
		href="/system/supplements"
	/>
</main>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}
</style>
