<script lang="ts">
	interface Props {
		title: string;
		body: string;
	}
	let { title, body }: Props = $props();
</script>

<div class="card" role="alert" aria-live="polite">
	<p class="t">{title}</p>
	<pre class="b">{body}</pre>
</div>

<style>
	.card {
		margin: var(--space-3) 0;
		padding: var(--space-4);
		border-radius: var(--radius-md);
		border: 1px solid var(--red-line);
		background: rgba(255, 42, 42, 0.09);
	}

	.t {
		margin: 0 0 var(--space-2);
		font-size: 15px;
		font-weight: 650;
		color: var(--red);
	}

	.b {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
		font-family: var(--font-mono);
		font-size: 12px;
		line-height: 1.45;
		color: var(--text-2);
	}
</style>
