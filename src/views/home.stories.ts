import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { expect, within } from 'storybook/test'
import '../components/background-shards'
import { renderPage, renderSection } from '../story-utils'
import page from 'virtual:page/index.html'
import css from '../styles/home.css?inline'

/**
 * The home page: the animated self-portrait, a CSS Grid collage of content
 * sections, and the decorative shard artwork behind them.
 *
 * Stories render the real `index.html` markup, so they track the page itself.
 */
const meta: Meta = {
	title: 'Views/Home',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: { description: { component: 'Single breakpoint at 600px: one column below, seven-column grid above.' } },
	},
	render: () => renderPage(page, css),
}

export default meta
type Story = StoryObj

/** The full page at desktop width. */
export const Desktop: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await expect(canvas.getByRole('heading', { name: 'About Me' })).toBeInTheDocument()
		await expect(canvasElement.querySelectorAll('.main-grid section')).toHaveLength(5)
		await expect(canvasElement.querySelector('.self-portrait')).toBeInTheDocument()
	},
}

/** Below 600px the collage collapses to a single column and shards are hidden. */
export const Mobile: Story = {
	globals: { viewport: { value: 'mobile1' } },
}

/** The self-portrait on its own — 445 polygons that line-draw themselves in. */
export const Portrait: Story = {
	render: () => renderSection(page, css, '.portrait'),
	play: async ({ canvasElement }) => {
		await expect(canvasElement.querySelectorAll('.self-portrait polygon').length).toBeGreaterThan(400)
	},
}

/** The five content sections, without the decorative artwork. */
export const ContentSections: Story = {
	render: () => renderSection(page, css, '.main-grid'),
	play: async ({ canvasElement }) => {
		const headings = [...canvasElement.querySelectorAll('h2')].map((h) => h.textContent)
		await expect(headings).toEqual(['About Me', 'Coding', 'Writing', 'Illustrating', 'Speaking'])
	},
}

/** Every outbound link on the page, for a quick link audit. */
export const Links: Story = {
	render: () => renderSection(page, css, '.main-grid'),
	play: async ({ canvasElement }) => {
		const hrefs = [...canvasElement.querySelectorAll('a')].map((a) => a.getAttribute('href'))
		await expect(hrefs).toContain('/sketchnotes.html')
		await expect(hrefs.every((href) => href && href.length > 0)).toBe(true)
	},
}

/** Motion suppressed: the portrait lands on its finished state immediately. */
export const ReducedMotion: Story = {
	parameters: { chromatic: { prefersReducedMotion: 'reduce' } },
	render: () => renderSection(page, css, '.portrait'),
}
