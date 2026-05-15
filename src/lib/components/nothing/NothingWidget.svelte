<script lang="ts">
	interface Props {
		eyebrow?: string;
		title: string;
		value?: string;
		meta?: string;
		progress?: number;
		actionLabel?: string;
	}
	let { eyebrow, title, value, meta, progress, actionLabel }: Props = $props();
</script>

<section class="widget nothing-surface">
	{#if eyebrow}
		<p class="eyebrow mono-caps">{eyebrow}</p>
	{/if}
	<div class="head">
		<h2 class="title">{title}</h2>
		{#if value}
			<p class="value">{value}</p>
		{/if}
	</div>
	{#if meta}
		<p class="meta">{meta}</p>
	{/if}
	{#if progress != null && progress >= 0}
		<div
			class="bar"
			role="progressbar"
			aria-valuenow={progress}
			aria-valuemin={0}
			aria-valuemax={100}
		>
			<div class="bar-fill" style:width={`${Math.min(100, progress)}%`}></div>
		</div>
	{/if}
	{#if actionLabel}
		<p class="action mono-caps">{actionLabel}</p>
	{/if}
</section>

<style>
	.widget {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.eyebrow {
		margin: 0;
		color: var(--text-3);
	}

	.head {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.title {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-1);
	}

	.value {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-1);
		white-space: nowrap;
	}

	.meta {
		margin: 0;
		font-size: 12px;
		color: var(--text-2);
		font-family: var(--font-mono);
	}

	.bar {
		height: 3px;
		background: var(--surface-3);
		border-radius: 2px;
		overflow: hidden;
		margin-top: var(--space-1);
	}

	.bar-fill {
		height: 100%;
		background: var(--red);
		border-radius: 2px;
	}

	.action {
		margin: var(--space-2) 0 0;
		color: var(--red);
	}
</style>
