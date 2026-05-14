<script lang="ts">
	interface Props {
		checked: boolean;
		label: string;
		quantity: string;
		onToggle?: () => void;
	}
	let { checked, label, quantity, onToggle }: Props = $props();
</script>

<label class="row">
	<input type="checkbox" class="cb" {checked} onchange={() => onToggle?.()} />
	<span class="txt">{label}</span>
	<span class="qty mono-caps">{quantity}</span>
</label>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 42px;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--line-1);
		cursor: pointer;
	}

	.cb {
		width: 20px;
		height: 20px;
		accent-color: var(--red);
		flex-shrink: 0;
	}

	.txt {
		flex: 1;
		font-size: 15px;
		color: var(--text-1);
	}

	.qty {
		font-size: 9px;
		color: var(--text-3);
		flex-shrink: 0;
	}
</style>
