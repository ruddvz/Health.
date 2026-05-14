<script lang="ts">
	let t = $state('');
	$effect(() => {
		const id = setInterval(() => {
			t = new Intl.DateTimeFormat(undefined, {
				hour: 'numeric',
				minute: '2-digit',
				hour12: false
			}).format(new Date());
		}, 30000);
		t = new Intl.DateTimeFormat(undefined, {
			hour: 'numeric',
			minute: '2-digit',
			hour12: false
		}).format(new Date());
		return () => clearInterval(id);
	});
</script>

<div class="strip mono-caps" role="status" aria-live="off">
	<span class="t">{t}</span>
	<span class="dot" aria-hidden="true">·</span>
	<span>Local</span>
	<span class="dot" aria-hidden="true">·</span>
	<span class="mono">HEALTH</span>
</div>

<style>
	.strip {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		min-height: 24px;
		padding: var(--space-2) 0 var(--space-1);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-3);
		font-family: var(--font-mono);
	}

	.dot {
		opacity: 0.45;
		user-select: none;
	}

	.t {
		letter-spacing: 0.06em;
		color: var(--text-2);
	}
</style>
