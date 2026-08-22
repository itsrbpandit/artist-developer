/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { pageSource } from './vite-plugin-page-source'

const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	// Lets stories import a page's markup: `import page from 'virtual:page/index.html'`
	plugins: [pageSource(projectRoot)],
	// Multi-page app: three standalone pages.
	build: {
		rollupOptions: {
			input: {
				index: resolve(projectRoot, 'index.html'),
				demos: resolve(projectRoot, 'demos.html'),
				sketchnotes: resolve(projectRoot, 'sketchnotes.html'),
			},
		},
	},
	// Runs every story as a browser test.
	// https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
	test: {
		projects: [
			{
				extends: true,
				plugins: [storybookTest({ configDir: join(projectRoot, '.storybook') })],
				// The addon's setup file lives in node_modules, so Vite's dependency
				// scan misses its CJS deps (testing-library internals); pre-bundle
				// them explicitly or the browser rejects their named exports.
				optimizeDeps: {
					include: ['aria-query', 'lz-string', 'dom-accessibility-api', 'pretty-format'],
				},
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [{ browser: 'chromium' }],
					},
				},
			},
		],
	},
})
