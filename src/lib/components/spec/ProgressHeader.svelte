<script lang="ts">
	interface Props {
		label: string;
		progress: number;
	}
	let { label, progress }: Props = $props();
	const pct = $derived(Math.round(Math.min(1, Math.max(0, progress)) * 100));
</script>

<div class="wrap">
	<p class="mono-caps lab">{label}</p>
	<div class="track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
		<div class="fill" style:width={`${pct}%`}></div>
	</div>
</div>

<style>
	.wrap {
		margin-bottom: var(--space-4);
	}

	.lab {
		margin: 0 0 var(--space-2);
		color: var(--text-2);
	}

	.track {
		height: 7px;
		border-radius: 999px;
		background: var(--red-soft);
		overflow: hidden;
	}

	.fill {
		height: 100%;
		border-radius: 999px;
		background: var(--red);
		box-shadow: var(--shadow-red-glow);
		transition: width 0.28s ease;
	}
</style>
