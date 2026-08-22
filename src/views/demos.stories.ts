import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import '../components/demo-nav'
import '../components/hsl-clock'
import '../components/value-scale'
import { renderPage, renderSection } from '../story-utils'
import page from 'virtual:page/demos.html'
import css from '../styles/demos.css?inline'

/**
 * The demos page: three colour-theory demonstrations — the HSL clock, the
 * value scales, and the animated gem — navigable with Ctrl+Space.
 *
 * Stories render the real `demos.html` markup.
 */
const meta: Meta = {
	title: 'Views/Demos',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: { description: { component: 'Each demo fills the viewport; Ctrl+Space advances through them.' } },
	},
	render: () => renderPage(page, css),
}

export default meta
type Story = StoryObj

/** The whole page, first demo active. */
export const Desktop: Story = {
	play: async ({ canvasElement }) => {
		await expect(canvasElement.querySelectorAll('.demo-item')).toHaveLength(3)
		const active = canvasElement.querySelector('.demo-item.active h1')!
		await expect(active.textContent).toBe('HSL Clock')
	},
}

/** The same page on a phone-sized viewport. */
export const Mobile: Story = {
	globals: { viewport: { value: 'mobile1' } },
}

/** Ctrl+Space moves the active demo along, as the page's help text describes. */
export const KeyboardNavigation: Story = {
	play: async ({ canvasElement }) => {
		await userEvent.keyboard('{Control>} {/Control}')
		await waitFor(async () => {
			const active = canvasElement.querySelector('.demo-item.active h1')!
			await expect(active.textContent).toBe('Value Scales')
		})
	},
}

/** The clock demo alone, live and ticking. */
export const ClockDemo: Story = {
	render: () => renderSection(page, css, '.demo-item'),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await expect(canvas.getByRole('heading', { name: 'HSL Clock' })).toBeInTheDocument()
		await expect(canvasElement.querySelector('hsl-clock')).toBeInTheDocument()
	},
}

/** The three value scales together. */
export const ValueScales: Story = {
	render: () => renderSection(page, css, '.demo-item:nth-of-type(2)'),
	play: async ({ canvasElement }) => {
		const scales = canvasElement.querySelectorAll('value-scale')
		await expect(scales).toHaveLength(3)
		await expect([...scales].map((s) => s.getAttribute('variant'))).toEqual([
			'lightness',
			'saturation',
			'hue',
		])
	},
}

/** The gem: seven facets cycling through hue, demonstrating shape from value. */
export const GemDemo: Story = {
	render: () => renderSection(page, css, '.demo-item:nth-of-type(3)'),
	play: async ({ canvasElement }) => {
		const facets = canvasElement.querySelectorAll('[class^="gem"]')
		await expect(facets).toHaveLength(7)
		await expect(getComputedStyle(facets[0]!).animationName).toBe('adjust0')
	},
}
