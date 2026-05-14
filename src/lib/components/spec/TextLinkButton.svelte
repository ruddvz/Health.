<script lang="ts">
	interface Props {
		text: string;
		onclick?: () => void;
	}
	let { text, onclick }: Props = $props();
</script>

<button type="button" class="btn" {onclick}>{text}</button>

<style>
	.btn {
		display: block;
		width: 100%;
		margin: var(--space-2) 0;
		padding: var(--space-3);
		border: none;
		background: none;
		color: var(--text-2);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		text-align: center;
	}
</style>
