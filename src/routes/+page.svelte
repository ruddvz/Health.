<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import RedActionButton from '$lib/components/nothing/RedActionButton.svelte';
	import ProgressHeader from '$lib/components/spec/ProgressHeader.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import StepCard from '$lib/components/spec/StepCard.svelte';
	import TextLinkButton from '$lib/components/spec/TextLinkButton.svelte';
	import type { OnboardingState } from '$lib/types/planV2';
	import { onboarding, persistOnboarding, plan } from '$lib/stores/healthApp';

	const stepMeta = [
		{ label: 'STEP 1 OF 4', progress: 0.25, title: "Let's build\nyour plan" },
		{ label: 'STEP 2 OF 4', progress: 0.5, title: 'Your lifestyle' },
		{ label: 'STEP 3 OF 4', progress: 0.75, title: 'Your plan' },
		{ label: 'STEP 4 OF 4', progress: 1, title: 'Confirm & finish' }
	] as const;

	function st(n: 1 | 2 | 3 | 4): 'complete' | 'current' | 'locked' {
		const s = $onboarding.step;
		if (n < s) return 'complete';
		if (n === s) return 'current';
		return 'locked';
	}

	function patch(p: Partial<OnboardingState>) {
		persistOnboarding({ ...$onboarding, ...p });
	}

	function patchProfile(p: Partial<OnboardingState['profile']>) {
		persistOnboarding({ ...$onboarding, profile: { ...$onboarding.profile, ...p } });
	}

	function patchLifestyle(p: Partial<OnboardingState['lifestyle']>) {
		persistOnboarding({ ...$onboarding, lifestyle: { ...$onboarding.lifestyle, ...p } });
	}

	function goImport() {
		goto(resolve('/import'));
	}

	function next() {
		const s = $onboarding.step;
		if (s < 4) {
			patch({ step: (s + 1) as 1 | 2 | 3 | 4 });
		} else {
			patch({ confirmed: true });
			goto(resolve('/import'));
		}
	}

	let redirected = false;
	$effect(() => {
		if (!browser || redirected) return;
		if ($plan) {
			redirected = true;
			goto(resolve('/today'));
		}
	});
</script>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ProgressHeader
		label={stepMeta[$onboarding.step - 1].label}
		progress={stepMeta[$onboarding.step - 1].progress}
	/>

	{#if $onboarding.step === 1}
		<ScreenHeaderBlock
			title={stepMeta[0].title}
			subtitle="We'll use your plan to personalize your daily dashboard."
		/>
		<StepCard
			index={1}
			title="Your profile"
			subtitle="Basic info, goals & preferences"
			status={st(1)}
		/>
		<StepCard
			index={2}
			title="Your lifestyle"
			subtitle="Activity level & daily rhythm"
			status={st(2)}
		/>
		<StepCard index={3} title="Your plan" subtitle="Import your health plan" status={st(3)} />
		<StepCard index={4} title="Confirm & finish" subtitle="Review and generate" status={st(4)} />
		<div class="form nothing-surface">
			<label class="field">
				<span class="mono-caps lab">Name</span>
				<input
					class="inp"
					type="text"
					autocomplete="name"
					value={$onboarding.profile.name}
					oninput={(e) => patchProfile({ name: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Age</span>
				<input
					class="inp"
					type="number"
					min="1"
					max="120"
					value={$onboarding.profile.age}
					oninput={(e) => patchProfile({ age: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Sex</span>
				<select
					class="inp"
					value={$onboarding.profile.sex}
					onchange={(e) => patchProfile({ sex: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="female">Female</option>
					<option value="male">Male</option>
					<option value="other">Other</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Height (cm)</span>
				<input
					class="inp"
					type="number"
					value={$onboarding.profile.height_cm}
					oninput={(e) => patchProfile({ height_cm: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Weight (kg)</span>
				<input
					class="inp"
					type="number"
					value={$onboarding.profile.weight_kg}
					oninput={(e) => patchProfile({ weight_kg: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Goal</span>
				<input
					class="inp"
					type="text"
					placeholder="e.g. recomp"
					value={$onboarding.profile.goal}
					oninput={(e) => patchProfile({ goal: (e.target as HTMLInputElement).value })}
				/>
			</label>
		</div>
	{:else if $onboarding.step === 2}
		<ScreenHeaderBlock
			title={stepMeta[1].title}
			subtitle="Rhythm helps the app place meals and training."
		/>
		<StepCard
			index={1}
			title="Your profile"
			subtitle="Basic info, goals & preferences"
			status={st(1)}
		/>
		<StepCard
			index={2}
			title="Your lifestyle"
			subtitle="Activity level & daily rhythm"
			status={st(2)}
		/>
		<StepCard index={3} title="Your plan" subtitle="Import your health plan" status={st(3)} />
		<StepCard index={4} title="Confirm & finish" subtitle="Review and generate" status={st(4)} />
		<div class="form nothing-surface">
			<label class="field">
				<span class="mono-caps lab">Wake time</span>
				<input
					class="inp"
					type="time"
					value={$onboarding.lifestyle.wake_time}
					oninput={(e) => patchLifestyle({ wake_time: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Sleep time</span>
				<input
					class="inp"
					type="time"
					value={$onboarding.lifestyle.sleep_time}
					oninput={(e) => patchLifestyle({ sleep_time: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Training time</span>
				<input
					class="inp"
					type="time"
					value={$onboarding.lifestyle.training_time}
					oninput={(e) => patchLifestyle({ training_time: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Activity level</span>
				<select
					class="inp"
					value={$onboarding.lifestyle.activity_level}
					onchange={(e) =>
						patchLifestyle({ activity_level: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="low">Low</option>
					<option value="moderate">Moderate</option>
					<option value="high">High</option>
				</select>
			</label>
		</div>
	{:else if $onboarding.step === 3}
		<ScreenHeaderBlock
			title={stepMeta[2].title}
			subtitle="Import JSON on the next screen, or skip ahead."
		/>
		<StepCard
			index={1}
			title="Your profile"
			subtitle="Basic info, goals & preferences"
			status={st(1)}
		/>
		<StepCard
			index={2}
			title="Your lifestyle"
			subtitle="Activity level & daily rhythm"
			status={st(2)}
		/>
		<StepCard index={3} title="Your plan" subtitle="Import your health plan" status={st(3)} />
		<StepCard index={4} title="Confirm & finish" subtitle="Review and generate" status={st(4)} />
		<p class="copy">
			Use <strong>Copy Prompt</strong> for Claude, then paste the returned JSON in Import.
		</p>
	{:else}
		<ScreenHeaderBlock title={stepMeta[3].title} subtitle="Everything stays on this device." />
		<StepCard
			index={1}
			title="Your profile"
			subtitle="Basic info, goals & preferences"
			status={st(1)}
		/>
		<StepCard
			index={2}
			title="Your lifestyle"
			subtitle="Activity level & daily rhythm"
			status={st(2)}
		/>
		<StepCard index={3} title="Your plan" subtitle="Import your health plan" status={st(3)} />
		<StepCard index={4} title="Confirm & finish" subtitle="Review and generate" status={st(4)} />
		<section class="legal nothing-surface">
			<h2 class="mono-caps h">Privacy</h2>
			<p class="p">
				This app does not send your plan to a server. Data lives in your browser storage only.
			</p>
			<h2 class="mono-caps h">Local storage</h2>
			<p class="p">Clearing site data removes your plan unless you exported a backup JSON.</p>
		</section>
	{/if}

	<RedActionButton label={$onboarding.step < 4 ? 'Continue' : 'Start import'} onclick={next} />
	<TextLinkButton text="Skip for now" onclick={goImport} />
</main>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-8);
	}

	.copy {
		margin: 0 0 var(--space-4);
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-2);
	}

	.form {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.lab {
		color: var(--text-3);
		font-size: 9px;
	}

	.inp {
		border: 1px solid var(--line-1);
		border-radius: var(--radius-xs);
		padding: 10px 12px;
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-1);
		font-size: 16px;
	}

	.legal {
		padding: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.h {
		margin: var(--space-3) 0 var(--space-2);
		font-size: 10px;
		color: var(--text-3);
	}

	.h:first-child {
		margin-top: 0;
	}

	.p {
		margin: 0;
		font-size: 14px;
		color: var(--text-2);
		line-height: 1.5;
	}
</style>
