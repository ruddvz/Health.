<script lang="ts">
	interface Props {
		title: string;
		question: string;
		subtitle: string;
		cta: string;
		onclick?: () => void;
	}
	let { title, question, subtitle, cta, onclick }: Props = $props();
</script>

<section class="card nothing-surface">
	<p class="mono-caps t">{title}</p>
	<p class="q">{question}</p>
	<p class="s">{subtitle}</p>
	<button type="button" class="btn pressable" {onclick}>{cta}</button>
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

	.q {
		margin: var(--space-2) 0 0;
		font-size: 17px;
		font-weight: 650;
		color: var(--text-1);
	}

	.s {
		margin: var(--space-2) 0 var(--space-3);
		font-size: 13px;
		color: var(--text-2);
		line-height: 1.45;
	}

	.btn {
		width: 100%;
		min-height: 48px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--line-2);
		background: var(--surface-2);
		color: var(--text-1);
		font-weight: 650;
		font-size: 14px;
		cursor: pointer;
	}
</style>
