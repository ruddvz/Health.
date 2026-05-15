<script lang="ts">
	interface M {
		label: string;
		value: string;
		color: 'red' | 'warning' | 'text';
	}
	interface Props {
		title: string;
		message: string;
		metrics: M[];
		cta: string;
		onCta?: () => void;
	}
	let { title, message, metrics, cta, onCta }: Props = $props();
</script>

<section class="card nothing-surface" aria-label={title}>
	<p class="mono-caps t">{title}</p>
	<p class="msg">{message}</p>
	<div class="grid">
		{#each metrics as m (m.label)}
			<div class="cell">
				<p class="mono-caps lab">{m.label}</p>
				<p class="val" class:red={m.color === 'red'} class:warn={m.color === 'warning'}>
					{m.value}
				</p>
			</div>
		{/each}
	</div>
	<button type="button" class="cta pressable" onclick={() => onCta?.()}>{cta}</button>
</section>

<style>
	.card {
		padding: var(--space-4);
		margin-bottom: var(--space-3);
	}

	.t {
		margin: 0;
		color: var(--red);
		font-size: 10px;
	}

	.msg {
		margin: var(--space-2) 0 var(--space-3);
		font-size: 15px;
		color: var(--text-1);
		line-height: 1.45;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.cell {
		padding: var(--space-2);
		border-radius: var(--radius-xs);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--line-1);
	}

	.lab {
		margin: 0 0 4px;
		font-size: 8px;
		color: var(--text-3);
	}

	.val {
		margin: 0;
		font-size: 14px;
		font-weight: 700;
		color: var(--text-1);
	}

	.val.red {
		color: var(--red);
	}

	.val.warn {
		color: var(--warning);
	}

	.cta {
		width: 100%;
		min-height: 44px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--line-2);
		background: transparent;
		color: var(--text-1);
		font-weight: 650;
		font-size: 14px;
		cursor: pointer;
	}
</style>
