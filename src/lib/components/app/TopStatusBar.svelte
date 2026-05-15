<script lang="ts">
	interface Props {
		weekLabel?: string;
		dayMode?: 'workout' | 'rest';
	}
	let { weekLabel = 'WEEK —', dayMode = 'workout' }: Props = $props();

	const modeLabel = $derived(dayMode === 'workout' ? 'WORKOUT DAY' : 'REST DAY');
</script>

<div class="strip mono-caps" role="status">
	<span>Private</span>
	<span class="sep" aria-hidden="true">·</span>
	<span>Offline</span>
	<span class="sep" aria-hidden="true">·</span>
	<span>Personal</span>
	<span class="sep" aria-hidden="true">·</span>
	<span>{weekLabel}</span>
	<span class="sep" aria-hidden="true">·</span>
	<span>{modeLabel}</span>
</div>

<style>
	.strip {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-bottom: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-3);
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.sep {
		color: var(--line-2);
		user-select: none;
	}
</style>
