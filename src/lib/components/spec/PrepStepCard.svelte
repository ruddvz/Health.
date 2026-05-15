<script lang="ts">
	interface Props {
		title: string;
		subtitle: string;
		time: string;
		checked: boolean;
		onToggle?: () => void;
	}
	let { title, subtitle, time, checked, onToggle }: Props = $props();
</script>

<div class="card nothing-surface">
	<label class="row">
		<input type="checkbox" class="cb" {checked} onchange={() => onToggle?.()} />
		<div class="mid">
			<p class="t">{title}</p>
			<p class="s">{subtitle}</p>
		</div>
		<span class="mono-caps tm">{time}</span>
	</label>
</div>

<style>
	.card {
		padding: 0;
		margin-bottom: var(--space-2);
		overflow: hidden;
	}

	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		min-height: 76px;
		cursor: pointer;
	}

	.cb {
		width: 20px;
		height: 20px;
		accent-color: var(--red);
		flex-shrink: 0;
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
		font-size: 13px;
		color: var(--text-2);
		line-height: 1.35;
	}

	.tm {
		font-size: 9px;
		color: var(--text-3);
		flex-shrink: 0;
	}
</style>
