<script lang="ts">
	interface Props {
		title: string;
		tag: string;
		duration: string;
		description: string;
	}
	let { title, tag, duration, description }: Props = $props();
</script>

<section class="hero nothing-surface">
	<div class="top">
		<p class="mono-caps tag">{tag}</p>
		<p class="mono-caps dur">{duration}</p>
	</div>
	<h2 class="title">{title}</h2>
	<p class="desc">{description}</p>
</section>

<style>
	.hero {
		padding: var(--space-4);
		margin-bottom: var(--space-3);
		min-height: 160px;
		position: relative;
		overflow: hidden;
	}

	.hero::after {
		content: '';
		position: absolute;
		right: -20%;
		bottom: -40%;
		width: 70%;
		height: 90%;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 42, 42, 0.12) 0%, transparent 70%);
		pointer-events: none;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-3);
		position: relative;
		z-index: 1;
	}

	.tag,
	.dur {
		margin: 0;
		font-size: 9px;
		color: var(--text-3);
	}

	.title {
		margin: 0;
		position: relative;
		z-index: 1;
		font-family: var(--font-mono);
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		line-height: 1.25;
		text-transform: uppercase;
		color: var(--text-1);
	}

	.desc {
		margin: var(--space-3) 0 0;
		position: relative;
		z-index: 1;
		font-size: 14px;
		line-height: 1.45;
		color: var(--text-2);
	}
</style>
