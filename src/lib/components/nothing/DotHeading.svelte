<script lang="ts">
	interface Props {
		text: string;
	}
	let { text }: Props = $props();
</script>

<h1 class="dot-heading mono-caps">{text}</h1>

<style>
	.dot-heading {
		margin: 0 0 var(--space-2);
		font-size: clamp(1.75rem, 6vw, 2.25rem);
		font-weight: 700;
		letter-spacing: 0.18em;
		line-height: 1.1;
		color: var(--text-1);
		font-family: var(--font-mono);
		text-transform: uppercase;
		position: relative;
		display: inline-block;
	}

	.dot-heading::after {
		content: '';
		display: inline-block;
		width: 6px;
		height: 1.1em;
		margin-left: 2px;
		vertical-align: -2px;
		background: linear-gradient(
			180deg,
			var(--red) 0%,
			var(--red) 55%,
			transparent 55%,
			transparent 100%
		);
		animation: blink 1.1s step-end infinite;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dot-heading::after {
			animation: none;
			opacity: 1;
		}
	}
</style>
