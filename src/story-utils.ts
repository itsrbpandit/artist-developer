import { html, type TemplateResult } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

/**
 * Helpers shared by the stories.
 *
 * View stories render the actual markup of the shipped `.html` files rather
 * than a copy, so a story can never drift from the page it documents. The
 * page's `<script>` tags are stripped (stories import the components they
 * need directly) and its stylesheet is attached as a real `<style>` element,
 * which keeps each story self-contained in `storybook dev` and in a built
 * `storybook-static` alike.
 */

/**
 * Builds a `<style>` node holding `css`.
 *
 * lit-html does not support bindings inside a `<style>` tag, so the element is
 * created imperatively and rendered as a node.
 */
export const styleElement = (css: string): HTMLStyleElement => {
	const style = document.createElement('style')
	style.textContent = css
	return style
}

/** Everything inside `<body>`, minus the module scripts. */
export const bodyOf = (page: string): string => {
	const body = page.slice(page.indexOf('<body>') + '<body>'.length, page.lastIndexOf('</body>'))
	return body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
}

/** Renders page markup with its stylesheet applied. */
export const renderPage = (page: string, css: string): TemplateResult =>
	html`${styleElement(css)}${unsafeHTML(bodyOf(page))}`

/** Renders a single named section of a page, for focused stories. */
export const renderSection = (page: string, css: string, selector: string): TemplateResult => {
	const template = document.createElement('template')
	template.innerHTML = bodyOf(page)
	const section = template.content.querySelector(selector)
	if (!section) throw new Error(`Section not found in page: ${selector}`)
	return html`${styleElement(css)}${unsafeHTML(section.outerHTML)}`
}
