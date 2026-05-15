<script lang="ts">
	interface Props {
		label: string;
		onclick?: () => void;
	}
	let { label, onclick }: Props = $props();
</script>

<button type="button" class="btn pressable" {onclick}>
	<span class="mono-caps ico" aria-hidden="true">↑</span>
	{label}
</button>

<style>
	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		min-height: 62px;
		margin-bottom: var(--space-3);
		border-radius: var(--radius-md);
		border: 1px dashed var(--line-3);
		background: transparent;
		color: var(--text-1);
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
	}

	.ico {
		font-size: 10px;
		color: var(--text-3);
	}
</style>
