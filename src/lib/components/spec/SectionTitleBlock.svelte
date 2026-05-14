<script lang="ts">
	interface Props {
		title: string;
		subtitle: string;
		subtitleColor?: 'red' | 'default';
	}
	let { title, subtitle, subtitleColor = 'default' }: Props = $props();
</script>

<div class="block">
	<h2 class="title">{title}</h2>
	<p class="sub" class:red={subtitleColor === 'red'}>{subtitle}</p>
</div>

<style>
	.block {
		margin: var(--space-3) 0;
	}

	.title {
		margin: 0;
		font-size: 20px;
		font-weight: 650;
		color: var(--text-1);
	}

	.sub {
		margin: 6px 0 0;
		font-size: 14px;
		color: var(--text-2);
	}

	.sub.red {
		color: var(--red);
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.06em;
	}
</style>
