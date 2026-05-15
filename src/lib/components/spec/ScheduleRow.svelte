<script lang="ts">
	interface Props {
		time: string;
		title: string;
		subtitle: string;
		checked: boolean;
		onToggle?: () => void;
	}
	let { time, title, subtitle, checked, onToggle }: Props = $props();
</script>

<div class="row nothing-surface-2">
	<span class="mono-caps tm">{time}</span>
	<div class="mid">
		<p class="t">{title}</p>
		<p class="s">{subtitle}</p>
	</div>
	<label class="tog">
		<input type="checkbox" class="cb" {checked} onchange={() => onToggle?.()} />
	</label>
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-height: 56px;
		padding: var(--space-2) var(--space-3);
		margin-bottom: var(--space-2);
	}

	.tm {
		width: 44px;
		flex-shrink: 0;
		font-size: 9px;
		color: var(--text-3);
	}

	.mid {
		flex: 1;
		min-width: 0;
	}

	.t {
		margin: 0;
		font-size: 15px;
		font-weight: 600;
		color: var(--text-1);
	}

	.s {
		margin: 4px 0 0;
		font-size: 12px;
		color: var(--text-2);
	}

	.cb {
		width: 20px;
		height: 20px;
		accent-color: var(--red);
	}
</style>
