import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

const PREFIX = 'virtual:page/'
/**
 * Resolved ids keep a `.js` extension (rather than the usual `\0` virtual
 * prefix) so esbuild's dependency scanner can parse the generated module
 * instead of failing the whole scan.
 */
const SUFFIX = '.page-source.js'

/**
 * Exposes a page's HTML source as a string module:
 *
 * ```ts
 * import page from 'virtual:page/index.html'
 * ```
 *
 * Vite's own `?raw` suffix cannot do this for `.html` files — the dev server's
 * HTML middleware intercepts the request and serves the document itself, so the
 * browser rejects it as a module. Going through this plugin behaves identically
 * in dev, in a production build, and under Vitest.
 *
 * Stories use it so they render the real page markup instead of a copy.
 */
export const pageSource = (root: string): Plugin => ({
	name: 'page-source',

	resolveId(id) {
		if (!id.startsWith(PREFIX)) return null
		return join(root, id.slice(PREFIX.length) + SUFFIX)
	},

	load(id) {
		if (!id.endsWith(SUFFIX)) return null
		const file = id.slice(0, -SUFFIX.length)
		this.addWatchFile(file)
		return `export default ${JSON.stringify(readFileSync(file, 'utf8'))}`
	},
})
