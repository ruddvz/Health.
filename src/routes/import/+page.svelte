<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import DashedUploadButton from '$lib/components/spec/DashedUploadButton.svelte';
	import InlineErrorCard from '$lib/components/spec/InlineErrorCard.svelte';
	import JsonDropZone from '$lib/components/spec/JsonDropZone.svelte';
	import ListRowButton from '$lib/components/spec/ListRowButton.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import TextLinkButton from '$lib/components/spec/TextLinkButton.svelte';
	import { MAX_PLAN_BYTES } from '$lib/constants/storage';
	import { buildClaudePrompt, copyTextToClipboard } from '$lib/logic/buildClaudePrompt';
	import { flattenGrocery } from '$lib/logic/planDerive';
	import type { PlanV2 } from '$lib/types/planV2';
	import { onboarding, persistProgress, progress, savePlan } from '$lib/stores/healthApp';
	import { get } from 'svelte/store';
	import { parsePlanJsonText } from '$lib/validation/planV2';

	let busy = $state(false);
	let error = $state<string | null>(null);
	let pasteOpen = $state(false);
	let pasteText = $state('');
	let fileInput: HTMLInputElement | null = null;
	let copyHint = $state<string | null>(null);
	let copyTimer: ReturnType<typeof setTimeout> | null = null;

	const importTitle = 'Bring in your\nhealth plan';

	/** Avoid raw `{` / `}` in markup (Svelte parses them as blocks). */
	const OPEN_BRACE = '{';
	const CLOSE_BRACE = '}';

	const promptBody = $derived(buildClaudePrompt($onboarding));

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
		copyHint = null;
		if (copyTimer) {
			clearTimeout(copyTimer);
			copyTimer = null;
		}
		const text = buildClaudePrompt(get(onboarding));
		const how = await copyTextToClipboard(text);
		if (how === 'failed') {
			copyHint =
				'Automatic copy failed — scroll to the prompt box below, tap inside it, then use your browser’s copy command.';
			return;
		}
		copyHint =
			how === 'execCommand'
				? 'Copied (fallback). Paste into Claude.'
				: 'Copied. Paste into Claude.';
		copyTimer = setTimeout(() => {
			copyHint = null;
			copyTimer = null;
		}, 2500);
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

	<JsonDropZone {busy} onFiles={onDropFiles} onBrowse={openPicker} />

	<section class="prompt-block nothing-surface" aria-labelledby="prompt-h">
		<h2 id="prompt-h" class="mono-caps sec-title">Claude prompt</h2>
		<p class="sec-sub">
			Built from your saved intake answers. Blank fields appear as "not specified" in the profile
			JSON. You can always copy from the box if the button fails.
		</p>
		<ListRowButton
			label={copyHint?.startsWith('Copied') ? 'Copied ✓' : 'Copy prompt'}
			onclick={copyPrompt}
		/>
		{#if copyHint}
			<p class="copy-hint" role="status">{copyHint}</p>
		{/if}
		<label class="sr-only" for="prompt-ta">Generated Claude prompt</label>
		<textarea id="prompt-ta" class="prompt-ta" readonly rows="12" value={promptBody}></textarea>
		<TextLinkButton text="Edit intake answers" onclick={() => goto(resolve('/'))} />
	</section>

	<ListRowButton label="Paste JSON" chevron onclick={() => (pasteOpen = true)} />
	<DashedUploadButton label="Upload Plan File" onclick={openPicker} />

	<section class="steps nothing-surface" aria-labelledby="steps-h">
		<h2 id="steps-h" class="mono-caps sec-title">After you copy</h2>
		<ol class="steps-list">
			<li><strong>Step 1</strong> — Open claude.ai (or the Claude app).</li>
			<li><strong>Step 2</strong> — Paste the prompt into a new conversation and send.</li>
			<li>
				<strong>Step 3</strong> — Wait for the reply; you want plain JSON only (message starts with
				<kbd>{OPEN_BRACE}</kbd> and ends with <kbd>{CLOSE_BRACE}</kbd>).
			</li>
			<li><strong>Step 4</strong> — If Claude used a code fence, copy only the JSON inside it.</li>
			<li>
				<strong>Step 5</strong> — Save as <kbd>myplan.json</kbd> or use <strong>Paste JSON</strong> below.
			</li>
			<li><strong>Step 6</strong> — Return here and upload the file or paste to validate.</li>
		</ol>
	</section>

	<p class="helper">Your uploaded plan is stored only in this browser.</p>

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
		font-size: 12px;
		line-height: calc(17 / 12);
		font-weight: 400;
		color: var(--text-3);
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

	.prompt-block,
	.steps {
		padding: var(--space-4);
		margin-bottom: var(--space-3);
		border-radius: var(--radius-list);
		border: 1px solid var(--line-1);
	}

	.sec-title {
		margin: 0 0 var(--space-2);
		font-size: 10px;
		color: var(--text-3);
		letter-spacing: 0.08em;
	}

	.sec-sub {
		margin: 0 0 var(--space-3);
		font-size: 13px;
		line-height: 1.45;
		color: var(--text-2);
	}

	.copy-hint {
		margin: calc(var(--space-2) * -1) 0 var(--space-3);
		font-size: 13px;
		line-height: 1.4;
		color: var(--text-2);
	}

	.prompt-ta {
		width: 100%;
		min-height: 200px;
		margin: var(--space-2) 0 var(--space-3);
		padding: var(--space-3);
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.45);
		color: var(--text-2);
		font-family: var(--font-mono);
		font-size: 11px;
		line-height: 1.4;
		resize: vertical;
	}

	.steps-list {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 13px;
		line-height: 1.5;
		color: var(--text-2);
	}

	.steps-list li {
		margin-bottom: var(--space-2);
	}

	.steps-list kbd {
		font-family: var(--font-mono);
		font-size: 0.95em;
		padding: 0 4px;
		border-radius: 4px;
		border: 1px solid var(--line-2);
		background: rgba(0, 0, 0, 0.35);
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
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		border: 1px solid var(--line-1);
		max-height: 90dvh;
		overflow: auto;
	}

	@supports (corner-shape: squircle) {
		.sheet {
			corner-shape: squircle;
		}
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
