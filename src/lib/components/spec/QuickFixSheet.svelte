<script lang="ts">
	import { QUICK_FIX_PRESETS, type QuickFixPreset } from '$lib/logic/quickFixPresets';

	interface Props {
		open: boolean;
		onClose: () => void;
		onPick: (p: QuickFixPreset) => void;
	}
	let { open, onClose, onPick }: Props = $props();
</script>

{#if open}
	<div class="modal" role="presentation">
		<button type="button" class="backdrop" aria-label="Close" onclick={onClose}></button>
		<div class="sheet nothing-surface" role="dialog" aria-modal="true" aria-labelledby="qf-h">
			<h2 id="qf-h" class="mono-caps h">Quick fix</h2>
			<p class="sub">Adds a logged snack for today. Stored only on this device.</p>
			<div class="grid">
				{#each QUICK_FIX_PRESETS as p (p.label)}
					<button type="button" class="chip pressable" onclick={() => onPick(p)}>
						<span class="name">{p.label}</span>
						<span class="meta mono-caps"
							>{p.kcal} kcal · P{p.protein_g} C{p.carbs_g} F{p.fat_g}</span
						>
					</button>
				{/each}
			</div>
			<button type="button" class="ghost pressable" onclick={onClose}>Close</button>
		</div>
	</div>
{/if}

<style>
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
		max-height: 88dvh;
		overflow: auto;
	}

	.h {
		margin: 0 0 var(--space-2);
		font-size: 11px;
		color: var(--text-2);
	}

	.sub {
		margin: 0 0 var(--space-4);
		font-size: 13px;
		color: var(--text-3);
		line-height: 1.45;
	}

	.grid {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-bottom: var(--space-3);
	}

	.chip {
		text-align: left;
		padding: var(--space-3);
		border-radius: var(--radius-sm);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.35);
		cursor: pointer;
	}

	.name {
		display: block;
		font-size: 14px;
		font-weight: 650;
		color: var(--text-1);
		margin-bottom: 6px;
	}

	.meta {
		font-size: 9px;
		color: var(--text-3);
		letter-spacing: 0.06em;
	}

	.ghost {
		width: 100%;
		min-height: 44px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--line-2);
		background: transparent;
		color: var(--text-1);
		font-weight: 650;
		cursor: pointer;
	}
</style>
