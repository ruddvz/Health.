<script lang="ts">
	interface Props {
		label: string;
		onclick?: () => void;
	}
	let { label, onclick }: Props = $props();
</script>

<button type="button" class="btn pressable" {onclick}>{label}</button>

<style>
	.btn {
		width: 100%;
		min-height: 50px;
		margin-bottom: var(--space-2);
		border-radius: var(--radius-sm);
		border: 1px solid var(--line-2);
		background: var(--surface-1);
		color: var(--text-1);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
	}
</style>
