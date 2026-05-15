<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import RedActionButton from '$lib/components/nothing/RedActionButton.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { LS_PLAN } from '$lib/constants/storage';
	import { clearAllLocalHealthData, plan } from '$lib/stores/healthApp';
	import { get } from 'svelte/store';

	function exportJson() {
		const p = get(plan);
		if (!p || !browser) return;
		const blob = new Blob([JSON.stringify(p, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'health-plan-backup.json';
		a.click();
		URL.revokeObjectURL(a.href);
	}

	function wipe() {
		const ok = window.confirm(
			'Delete all local app data from this device? This cannot be undone unless you exported a backup.'
		);
		if (!ok) return;
		clearAllLocalHealthData();
		goto(resolve('/'));
	}
</script>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ScreenHeaderBlock title="SETTINGS" subtitle="Data & backups" />

	<p class="mono-caps lab">Export</p>
	<p class="txt">
		Save a JSON backup of the plan currently in this browser ({browser
			? localStorage.getItem(LS_PLAN)
				? 'present'
				: 'empty'
			: '—'}).
	</p>
	<RedActionButton label="Download plan JSON" disabled={!$plan} onclick={exportJson} />

	<p class="mono-caps lab danger">Danger zone</p>
	<p class="txt">
		Clears keys: health.v2.plan, progress, grocery, settings, activeDayType, onboarding.
	</p>
	<button type="button" class="del pressable" onclick={wipe}>Delete all local data</button>
</main>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-6);
	}

	.lab {
		margin: var(--space-4) 0 var(--space-2);
		font-size: 10px;
		color: var(--text-3);
	}

	.lab.danger {
		color: var(--red);
	}

	.txt {
		margin: 0 0 var(--space-3);
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-2);
	}

	.del {
		width: 100%;
		min-height: 52px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--red-line);
		background: rgba(255, 42, 42, 0.12);
		color: var(--red);
		font-weight: 650;
		font-size: 15px;
		cursor: pointer;
	}
</style>
