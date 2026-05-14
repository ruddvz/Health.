<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DashedUploadButton from '$lib/components/spec/DashedUploadButton.svelte';
	import InlineErrorCard from '$lib/components/spec/InlineErrorCard.svelte';
	import JsonDropZone from '$lib/components/spec/JsonDropZone.svelte';
	import ListRowButton from '$lib/components/spec/ListRowButton.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import { MAX_PLAN_BYTES } from '$lib/constants/storage';
	import { flattenGrocery } from '$lib/logic/planDerive';
	import type { PlanV2 } from '$lib/types/planV2';
	import { persistProgress, progress, savePlan } from '$lib/stores/healthApp';
	import { get } from 'svelte/store';
	import { parsePlanJsonText } from '$lib/validation/planV2';

	let busy = $state(false);
	let error = $state<string | null>(null);
	let pasteOpen = $state(false);
	let pasteText = $state('');
	let fileInput: HTMLInputElement | null = null;

	const PROMPT_STUB = `You are a nutrition coach. Return ONLY valid JSON matching the Health plan schema v2 for this user profile. No markdown fences.`;

	const importTitle = 'Bring in your\nhealth plan';

	function mergeGroceryCheckedIntoProgress(planObj: PlanV2) {
		const items = flattenGrocery(planObj);
		const cur = get(progress);
		const next = { ...(cur.groceryChecked ?? {}) };
		for (const it of items) {
			if (!(it.key in next)) next[it.key] = false;
		}
		persistProgress({ ...cur, groceryChecked: next });
	}

	function applyParsed(text: string) {
		error = null;
		const r = parsePlanJsonText(text);
		if (!r.ok) {
			error = r.error;
			return false;
		}
		savePlan(r.plan, r.warnings);
		mergeGroceryCheckedIntoProgress(r.plan);
		goto(resolve('/today'));
		return true;
	}

	async function readFile(f: File) {
		if (f.size > MAX_PLAN_BYTES) {
			error = `File exceeds ${MAX_PLAN_BYTES / (1024 * 1024)} MB limit.`;
			return;
		}
		busy = true;
		try {
			const text = await f.text();
			applyParsed(text);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Could not read file';
		} finally {
			busy = false;
		}
	}

	async function onFile(ev: Event) {
		const t = ev.target as HTMLInputElement;
		const f = t.files?.[0];
		t.value = '';
		if (!f) return;
		await readFile(f);
	}

	async function onDropFiles(files: File[]) {
		const f = files[0];
		if (!f) return;
		await readFile(f);
	}

	function openPicker() {
		fileInput?.click();
	}

	async function copyPrompt() {
		error = null;
		try {
			await navigator.clipboard.writeText(PROMPT_STUB);
		} catch {
			error = 'Clipboard unavailable in this context.';
		}
	}

	function validatePaste() {
		applyParsed(pasteText);
		if (!error) pasteOpen = false;
	}
</script>

<input
	bind:this={fileInput}
	class="sr"
	type="file"
	accept=".json,application/json"
	onchange={onFile}
/>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ScreenHeaderBlock
		eyebrow="IMPORT YOUR PLAN"
		title={importTitle}
		subtitle="Use your JSON plan to power your dashboard."
	/>

	<JsonDropZone {busy} onFiles={onDropFiles} />

	<ListRowButton label="Copy Prompt" chevron onclick={copyPrompt} />
	<ListRowButton label="Paste JSON" chevron onclick={() => (pasteOpen = true)} />
	<DashedUploadButton label="Upload Plan File" onclick={openPicker} />

	<p class="helper mono-caps">Your uploaded plan is stored only in this browser.</p>

	{#if error}
		<InlineErrorCard title="Import blocked" body={error} />
	{/if}
</main>

{#if pasteOpen}
	<div class="modal" role="presentation">
		<button type="button" class="backdrop" aria-label="Close" onclick={() => (pasteOpen = false)}
		></button>
		<div class="sheet nothing-surface" role="dialog" aria-modal="true" aria-labelledby="paste-h">
			<h2 id="paste-h" class="mono-caps h">Paste JSON</h2>
			<textarea class="ta" rows="10" bind:value={pasteText} aria-label="Plan JSON"></textarea>
			<div class="row">
				<button type="button" class="ghost pressable" onclick={() => (pasteOpen = false)}
					>Cancel</button
				>
				<button type="button" class="red pressable" onclick={validatePaste}>Validate</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-8);
	}

	.helper {
		margin: var(--space-3) 0 0;
		font-size: 9px;
		color: var(--text-3);
		line-height: 1.5;
	}

	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
		opacity: 0.02;
	}

	.modal {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.backdrop {
		position: absolute;
		inset: 0;
		border: none;
		background: rgba(0, 0, 0, 0.55);
		cursor: pointer;
	}

	.sheet {
		position: relative;
		width: min(100vw, 430px);
		padding: var(--space-4);
		border-radius: 18px 18px 0 0;
		border: 1px solid var(--line-1);
		max-height: 90dvh;
		overflow: auto;
	}

	.h {
		margin: 0 0 var(--space-3);
		font-size: 11px;
		color: var(--text-2);
	}

	.ta {
		width: 100%;
		min-height: 280px;
		padding: var(--space-3);
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.45);
		color: var(--text-2);
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 1.45;
		resize: vertical;
	}

	.row {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
	}

	.ghost,
	.red {
		flex: 1;
		min-height: 48px;
		border-radius: var(--radius-sm);
		font-weight: 650;
		cursor: pointer;
		border: 1px solid var(--line-2);
		background: transparent;
		color: var(--text-1);
	}

	.red {
		background: var(--red);
		border-color: var(--red);
		color: #fff;
	}
</style>
