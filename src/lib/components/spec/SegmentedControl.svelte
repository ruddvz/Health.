<script lang="ts">
	interface Opt {
		label: string;
		value: string;
	}
	interface Props {
		options: Opt[];
		selected: string;
		onSelect?: (value: string) => void;
	}
	let { options, selected, onSelect }: Props = $props();
</script>

<div class="seg nothing-surface-2" role="group">
	{#each options as o (o.value)}
		<button
			type="button"
			class="btn pressable"
			class:on={selected === o.value}
			aria-pressed={selected === o.value}
			onclick={() => onSelect?.(o.value)}
		>
			{o.label}
		</button>
	{/each}
</div>

<style>
	.seg {
		display: flex;
		padding: 3px;
		gap: 2px;
		border-radius: var(--radius-sm);
		margin-bottom: var(--space-3);
	}

	.btn {
		flex: 1;
		border: none;
		background: transparent;
		padding: 8px 10px;
		border-radius: 10px;
		font-size: 13px;
		font-weight: 600;
		color: var(--text-2);
		cursor: pointer;
		min-height: 38px;
	}

	.btn.on {
		background: var(--red);
		color: #fff;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
	}
</style>
