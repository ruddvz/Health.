<script lang="ts">
	interface Props {
		weekLabel?: string;
		dayMode?: 'workout' | 'rest';
	}
	let { weekLabel = 'WEEK —', dayMode = 'workout' }: Props = $props();

	const modeLabel = $derived(dayMode === 'workout' ? 'WORKOUT DAY' : 'REST DAY');
</script>

<div class="bar" role="status" aria-live="off">
	<div class="l mono-caps">
		<span class="brand">HEALTH</span>
	</div>
	<div class="r mono-caps">
		<span class="tag">Private</span>
		<span class="dot" aria-hidden="true">·</span>
		<span class="tag">Personal</span>
		<span class="dot" aria-hidden="true">·</span>
		<span>{weekLabel}</span>
		<span class="dot" aria-hidden="true">·</span>
		<span>{modeLabel}</span>
	</div>
</div>

<style>
	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2) var(--space-3);
		min-height: 28px;
		padding: var(--space-2) max(var(--space-4), env(safe-area-inset-left)) var(--space-2)
			max(var(--space-4), env(safe-area-inset-right));
		border-bottom: 1px solid var(--line-1);
		background: color-mix(in srgb, var(--bg) 82%, transparent);
		backdrop-filter: blur(16px) saturate(140%);
		-webkit-backdrop-filter: blur(16px) saturate(140%);
		color: var(--text-3);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-family: var(--font-mono);
	}

	.l,
	.r {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
	}

	.r {
		justify-content: flex-end;
		text-align: right;
	}

	.brand {
		color: var(--text-2);
	}

	.tag {
		color: var(--text-3);
	}

	.dot {
		opacity: 0.45;
		user-select: none;
	}
</style>
