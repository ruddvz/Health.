<script lang="ts">
	interface Props {
		label: string;
		value: string;
		subvalue: string;
		progress: number;
	}
	let { label, value, subvalue, progress }: Props = $props();
	const pct = $derived(Math.round(Math.min(1, Math.max(0, progress)) * 100));
</script>

<div class="tile nothing-surface">
	<p class="mono-caps lab">{label}</p>
	<p class="val">{value}</p>
	<p class="sub">{subvalue}</p>
	<div class="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
		<div class="fill" style:width={`${pct}%`}></div>
	</div>
</div>

<style>
	.tile {
		padding: var(--space-3);
		min-height: 92px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.lab {
		margin: 0;
		font-size: 9px;
		color: var(--text-3);
	}

	.val {
		margin: 0;
		font-size: 17px;
		font-weight: 650;
		color: var(--text-1);
	}

	.sub {
		margin: 0;
		font-size: 12px;
		color: var(--text-2);
	}

	.bar {
		margin-top: auto;
		height: 3px;
		background: var(--surface-3);
		border-radius: 2px;
		overflow: hidden;
	}

	.fill {
		height: 100%;
		background: var(--red);
		border-radius: 2px;
	}
</style>
