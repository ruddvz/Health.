<script lang="ts">
	interface Props {
		eyebrow: string;
		title: string;
		subtitle: string;
		onclick?: () => void;
	}
	let { eyebrow, title, subtitle, onclick }: Props = $props();
</script>

<button type="button" class="card nothing-surface pressable" {onclick}>
	<div class="left">
		<p class="mono-caps e">{eyebrow}</p>
		<p class="t">{title}</p>
		<p class="s">{subtitle}</p>
	</div>
	<span class="cta" aria-hidden="true">→</span>
</button>

<style>
	.card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		width: 100%;
		min-height: 84px;
		padding: var(--space-4);
		margin-bottom: var(--space-3);
		text-align: left;
		cursor: pointer;
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.e {
		margin: 0 0 var(--space-1);
		color: var(--text-3);
		font-size: 9px;
	}

	.t {
		margin: 0;
		font-size: 17px;
		font-weight: 650;
		color: var(--text-1);
	}

	.s {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--text-2);
	}

	.cta {
		font-size: 22px;
		color: var(--red);
		line-height: 1;
	}
</style>
