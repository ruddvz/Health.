<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	type InstallableEvent = Event & {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: string }>;
	};

	let closeInstallHint = $state(false);

	let deferred: InstallableEvent | null = null;
	let canInstall = $state(false);
	let userEngaged = $state(false);
	let delayElapsed = $state(false);

	const showInstallUi = $derived(canInstall && !closeInstallHint && (userEngaged || delayElapsed));

	onMount(() => {
		if (!browser) return;

		let swUpdateInterval: ReturnType<typeof setInterval> | undefined;

		const delayTimer = window.setTimeout(() => {
			delayElapsed = true;
		}, 12_000);

		function onFirstEngagement() {
			userEngaged = true;
			window.removeEventListener('pointerdown', onFirstEngagement, true);
		}
		window.addEventListener('pointerdown', onFirstEngagement, true);

		function onBip(e: Event) {
			e.preventDefault();
			deferred = e as InstallableEvent;
			canInstall = true;
		}
		window.addEventListener('beforeinstallprompt', onBip);

		import('virtual:pwa-register')
			.then(({ registerSW }) => {
				registerSW({
					immediate: true,
					onNeedRefresh() {
						// No in-app toast; reload the tab to pick up a new deploy.
					},
					onOfflineReady() {
						// No hint toast.
					},
					onRegisteredSW(_url, registration) {
						if (!registration) return;
						if (swUpdateInterval) clearInterval(swUpdateInterval);
						const fourHours = 4 * 60 * 60 * 1000;
						swUpdateInterval = setInterval(() => {
							void registration.update();
						}, fourHours);
					}
				});
			})
			.catch(() => {
				/* virtual module only under Vite */
			});

		return () => {
			if (swUpdateInterval) clearInterval(swUpdateInterval);
			clearTimeout(delayTimer);
			window.removeEventListener('pointerdown', onFirstEngagement, true);
			window.removeEventListener('beforeinstallprompt', onBip);
		};
	});

	async function installClick() {
		if (!deferred) return;
		deferred.prompt();
		await deferred.userChoice;
		deferred = null;
		canInstall = false;
	}
</script>

{#if showInstallUi}
	<div class="toast install nothing-surface-2">
		<p class="mono-caps title">Install</p>
		<p class="sub">Add to home screen for full-screen use.</p>
		<div class="row">
			<button type="button" class="primary pressable" onclick={installClick}>Install</button>
			<button type="button" class="ghost pressable" onclick={() => (closeInstallHint = true)}
				>Later</button
			>
		</div>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		left: var(--space-4);
		right: var(--space-4);
		bottom: calc(var(--nav-h) + var(--safe-bottom) + var(--space-5));
		z-index: 50;
		padding: var(--space-4);
		max-width: 400px;
		margin-inline: auto;
	}

	.title {
		margin: 0 0 var(--space-2);
		color: var(--red);
	}

	.install .sub {
		margin: 0 0 var(--space-3);
		font-size: 13px;
		color: var(--text-2);
		line-height: 1.4;
	}

	.row {
		display: flex;
		gap: var(--space-3);
	}

	.primary {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--red);
		border-radius: var(--radius-xs);
		background: var(--red);
		color: #0b0b0b;
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.ghost {
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--line-2);
		border-radius: var(--radius-xs);
		background: transparent;
		color: var(--text-2);
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
	}
</style>
