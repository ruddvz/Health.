<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';

	const tabs = [
		{ path: '/', href: `${base}/`, label: 'Today' },
		{ path: '/meals', href: `${base}/meals`, label: 'Meals' },
		{ path: '/train', href: `${base}/train`, label: 'Train' },
		{ path: '/progress', href: `${base}/progress`, label: 'Progress' },
		{ path: '/system', href: `${base}/system`, label: 'System' }
	] as const;

	function normalizePathname(pathname: string): string {
		let p = pathname;
		if (base && p.startsWith(base)) {
			p = p.slice(base.length) || '/';
		}
		if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
		return p || '/';
	}

	const currentPath = $derived(normalizePathname(page.url.pathname));

	function active(path: string) {
		return currentPath === path;
	}
</script>

<nav class="nav" aria-label="Primary">
	<ul class="list">
		{#each tabs as tab (tab.path)}
			<li>
				<a
					href={tab.href}
					class="tab pressable"
					class:active={active(tab.path)}
					data-sveltekit-preload-data="tap"
					aria-current={active(tab.path) ? 'page' : undefined}
				>
					<span class="mono-caps label">{tab.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.nav {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 30;
		padding-bottom: var(--safe-bottom);
		background: rgba(11, 11, 11, 0.92);
		backdrop-filter: blur(12px);
		border-top: 1px solid var(--line-1);
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		min-height: var(--nav-h);
	}

	li {
		margin: 0;
	}

	.tab {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: var(--nav-h);
		border-right: 1px solid var(--line-1);
		color: var(--text-3);
		text-decoration: none;
	}

	li:last-child .tab {
		border-right: none;
	}

	.tab.active {
		color: var(--red);
		background: var(--red-soft);
	}

	.label {
		font-size: 8px;
		letter-spacing: 0.06em;
		text-align: center;
		max-width: 100%;
		padding: 0 var(--space-1);
	}
</style>
