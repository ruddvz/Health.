<script lang="ts">
	interface Props {
		value: number;
		max: number;
		unit: string;
		label: string;
	}
	let { value, max, unit, label }: Props = $props();
	const pct = $derived(max <= 0 ? 0 : Math.min(1, value / max));
	const size = 78;
	const stroke = 6;
	const r = (size - stroke) / 2;
	const c = size / 2;
	const circ = 2 * Math.PI * r;
	const dash = $derived(circ * (1 - pct));
</script>

<div class="wrap" role="img" aria-label={`${label}: ${value} ${unit} of ${max}`}>
	<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
		<circle class="track" cx={c} cy={c} {r} fill="none" stroke-width={stroke} />
		<circle
			class="prog"
			cx={c}
			cy={c}
			{r}
			fill="none"
			stroke-width={stroke}
			stroke-dasharray={`${circ} ${circ}`}
			stroke-dashoffset={dash}
			transform={`rotate(-90 ${c} ${c})`}
		/>
	</svg>
	<div class="center">
		<span class="val">{value}{unit}</span>
		<span class="mono-caps sub">{label}</span>
	</div>
</div>

<style>
	.wrap {
		position: relative;
		width: 78px;
		height: 78px;
		flex-shrink: 0;
	}

	.track {
		stroke: rgba(255, 255, 255, 0.08);
	}

	.prog {
		stroke: var(--red);
		stroke-linecap: round;
		transition: stroke-dashoffset 0.35s ease;
	}

	.center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding-top: 2px;
	}

	.val {
		font-size: 13px;
		font-weight: 650;
		color: var(--text-1);
		font-family: var(--font-mono);
		line-height: 1.1;
	}

	.sub {
		margin-top: 2px;
		font-size: 8px;
		color: var(--text-3);
		max-width: 64px;
		line-height: 1.2;
	}
</style>
