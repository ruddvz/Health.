<script lang="ts">
	interface Props {
		busy?: boolean;
	}
	let { busy = false }: Props = $props();
</script>

<div class="zone nothing-surface" class:busy aria-busy={busy}>
	<div class="inner">
		<span class="mono-caps brace" aria-hidden="true">{'{ }'}</span>
		<p class="mono-caps lab">.JSON</p>
		<p class="hint">Drop a file or use upload below</p>
	</div>
</div>

<style>
	.zone {
		position: relative;
		min-height: 210px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--space-3);
		overflow: hidden;
	}

	.zone::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
			circle at 1px 1px,
			rgba(255, 255, 255, 0.065) 1px,
			transparent 0
		);
		background-size: 18px 18px;
		opacity: 0.35;
		pointer-events: none;
	}

	.inner {
		position: relative;
		text-align: center;
		padding: var(--space-6);
	}

	.brace {
		display: block;
		font-size: 42px;
		color: var(--text-3);
		letter-spacing: 0.08em;
		margin-bottom: var(--space-2);
	}

	.lab {
		margin: 0;
		font-size: 14px;
		color: var(--red);
		letter-spacing: 0.35em;
	}

	.hint {
		margin: var(--space-3) 0 0;
		font-size: 13px;
		color: var(--text-3);
	}

	.busy {
		opacity: 0.65;
	}
</style>
