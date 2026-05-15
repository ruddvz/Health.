<script lang="ts">
	interface Props {
		title: string;
		subtitle: string;
		tag: string;
	}
	let { title, subtitle, tag }: Props = $props();
</script>

<div class="card nothing-surface">
	<div class="row">
		<div class="mid">
			<p class="t">{title}</p>
			<p class="s">{subtitle}</p>
		</div>
		<span class="mono-caps tg">{tag}</span>
	</div>
</div>

<style>
	.card {
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-2);
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.t {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: var(--text-1);
	}

	.s {
		margin: 4px 0 0;
		font-size: 12px;
		color: var(--text-2);
	}

	.tg {
		font-size: 8px;
		color: var(--text-3);
		border: 1px solid var(--line-1);
		padding: 4px 8px;
		border-radius: 999px;
		flex-shrink: 0;
	}
</style>
