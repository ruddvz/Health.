<script lang="ts">
	interface Props {
		title: string;
		value: string;
		subtitle: string;
		bars: number[];
	}
	let { title, value, subtitle, bars }: Props = $props();
</script>

<section class="card nothing-surface" aria-label={title}>
	<div class="head">
		<div>
			<p class="mono-caps t">{title}</p>
			<p class="val">{value}</p>
			<p class="sub">{subtitle}</p>
		</div>
	</div>
	<div class="bars" role="img" aria-label={`${title} ${value} ${subtitle}`}>
		{#each bars as h, i (i)}
			<div class="bwrap">
				<div class="b" style:height={`${Math.round(h * 100)}%`}></div>
			</div>
		{/each}
	</div>
</section>

<style>
	.card {
		padding: var(--space-4);
		margin-bottom: var(--space-3);
	}

	.t {
		margin: 0;
		color: var(--text-3);
		font-size: 10px;
	}

	.val {
		margin: var(--space-2) 0 0;
		font-size: 22px;
		font-weight: 650;
		color: var(--text-1);
	}

	.sub {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--text-2);
	}

	.bars {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 88px;
		margin-top: var(--space-3);
		padding-top: var(--space-2);
		border-top: 1px solid var(--line-1);
	}

	.bwrap {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: flex-end;
	}

	.b {
		width: 100%;
		min-height: 4px;
		border-radius: 3px 3px 0 0;
		background: var(--red);
		opacity: 0.85;
	}
</style>
