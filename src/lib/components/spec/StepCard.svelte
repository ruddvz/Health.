<script lang="ts">
	type Status = 'complete' | 'current' | 'locked';

	interface Props {
		index: number;
		title: string;
		subtitle: string;
		status: Status;
	}
	let { index, title, subtitle, status }: Props = $props();
</script>

<div class="card nothing-surface" data-status={status}>
	<span class="idx mono-caps">{index}</span>
	<div class="body">
		<p class="t">{title}</p>
		<p class="s">{subtitle}</p>
	</div>
	<span class="ico mono-caps" aria-hidden="true"
		>{status === 'complete' ? 'OK' : status === 'current' ? '>' : '—'}</span
	>
</div>

<style>
	.card {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 64px;
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-3);
	}

	.card[data-status='locked'] {
		opacity: 0.55;
	}

	.idx {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 999px;
		border: 1px solid var(--line-2);
		color: var(--text-2);
		font-size: 9px;
		flex-shrink: 0;
	}

	.body {
		flex: 1;
		min-width: 0;
	}

	.t {
		margin: 0;
		font-size: 15px;
		font-weight: 650;
		color: var(--text-1);
	}

	.s {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--text-2);
		line-height: 1.35;
	}

	.ico {
		color: var(--red);
		font-size: 10px;
		flex-shrink: 0;
	}
</style>
