import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';

const dev = process.argv.includes('dev');
const basePath = dev ? '' : '/Health';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'prompt',
			strategies: 'generateSW',
			includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'offline.html'],
			manifest: {
				name: 'Health — Personal Plan',
				short_name: 'Health',
				description: 'Private offline health plan companion',
				start_url: `${basePath}/`,
				scope: `${basePath}/`,
				display: 'standalone',
				background_color: '#0b0b0b',
				theme_color: '#0b0b0b',
				orientation: 'portrait',
				categories: ['health', 'fitness', 'lifestyle'],
				icons: [
					{
						src: `${basePath}/icons/icon-192.png`,
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any maskable'
					},
					{
						src: `${basePath}/icons/icon-512.png`,
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			kit: {
				adapterFallback: '404.html',
				spa: true,
				includeVersionFile: true
			},
			workbox: {
				navigateFallbackDenylist: [/^\/api\//]
			},
			devOptions: {
				enabled: false
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
