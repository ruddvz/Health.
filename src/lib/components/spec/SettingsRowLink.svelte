<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AppRoute } from '$lib/appRoutes';

	interface Props {
		icon?: string;
		title: string;
		subtitle: string;
		chevron?: boolean;
		href?: AppRoute;
		tone?: 'default' | 'danger';
		onclick?: () => void;
	}
	let {
		icon = '·',
		title,
		subtitle,
		chevron = true,
		href,
		tone = 'default',
		onclick
	}: Props = $props();
</script>

{#if href}
	<a class="row nothing-surface pressable" class:danger={tone === 'danger'} href={resolve(href)}>
		<span class="mono-caps ico" aria-hidden="true">{icon}</span>
		<div class="mid">
			<p class="t">{title}</p>
			<p class="s">{subtitle}</p>
		</div>
		{#if chevron}
			<span class="chev" aria-hidden="true">›</span>
		{/if}
	</a>
{:else}
	<button
		type="button"
		class="row nothing-surface pressable"
		class:danger={tone === 'danger'}
		{onclick}
	>
		<span class="mono-caps ico" aria-hidden="true">{icon}</span>
		<div class="mid">
			<p class="t">{title}</p>
			<p class="s">{subtitle}</p>
		</div>
		{#if chevron}
			<span class="chev" aria-hidden="true">›</span>
		{/if}
	</button>
{/if}

<style>
	.row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		min-height: 64px;
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-2);
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		text-align: left;
		border: 1px solid var(--line-1);
	}

	.row.danger .t {
		color: var(--red);
	}

	.ico {
		width: 28px;
		text-align: center;
		color: var(--text-3);
		font-size: 9px;
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

	.chev {
		color: var(--text-3);
		font-size: 18px;
	}
</style>
