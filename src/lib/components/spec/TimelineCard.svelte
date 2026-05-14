<script lang="ts">
	interface Item {
		time: string;
		title: string;
		subtitle: string;
		state: 'done' | 'next' | 'upcoming';
	}
	interface Props {
		items: Item[];
	}
	let { items }: Props = $props();
</script>

<div class="card nothing-surface" role="list">
	{#each items as it, i (i)}
		<div class="row" role="listitem" data-state={it.state}>
			<span class="mono-caps time">{it.time}</span>
			<div class="mid">
				<p class="t">{it.title}</p>
				<p class="s">{it.subtitle}</p>
			</div>
			<span
				class="st mono-caps"
				aria-label={it.state === 'done' ? 'Done' : it.state === 'next' ? 'Next' : 'Upcoming'}
			>
				{it.state === 'done' ? '✓' : it.state === 'next' ? '→' : '·'}
			</span>
		</div>
	{/each}
</div>

<style>
	.card {
		padding: 0;
		overflow: hidden;
		margin-bottom: var(--space-3);
	}

	.row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--line-1);
	}

	.row:last-child {
		border-bottom: none;
	}

	.time {
		width: 64px;
		flex-shrink: 0;
		margin: 2px 0 0;
		font-size: 9px;
		color: var(--text-3);
	}

	.mid {
		flex: 1;
		min-width: 0;
	}

	.t {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: var(--text-1);
	}

	.s {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--text-2);
		line-height: 1.35;
	}

	.st {
		margin-top: 2px;
		color: var(--red);
		font-size: 10px;
	}

	.row[data-state='done'] .st {
		color: var(--ok);
	}
</style>
