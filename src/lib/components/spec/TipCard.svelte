<script lang="ts">
	interface Props {
		title: string;
		body: string;
	}
	let { title, body }: Props = $props();
</script>

<section class="tip nothing-surface">
	<p class="mono-caps t">{title}</p>
	<p class="b">{body}</p>
</section>

<style>
	.tip {
		padding: var(--space-4);
		margin-bottom: var(--space-3);
	}

	.t {
		margin: 0 0 var(--space-2);
		color: var(--text-3);
		font-size: 10px;
	}

	.b {
		margin: 0;
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-2);
	}
</style>
