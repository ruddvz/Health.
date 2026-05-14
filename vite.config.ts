import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { VitePWA } from 'vite-plugin-pwa';

const dev = process.argv.includes('dev');
const basePath = dev ? '' : '/Health';

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
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
			workbox: {
				globPatterns: ['**/*.{js,css,html,png,svg,webp,json,webmanifest}'],
				navigateFallback: `${basePath}/offline.html`,
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
