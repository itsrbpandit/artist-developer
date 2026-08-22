import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { expect, within } from 'storybook/test'
import { renderPage, renderSection } from '../story-utils'
import page from 'virtual:page/sketchnotes.html'
import css from '../styles/sketchnotes.css?inline'

/**
 * The sketchnotes gallery: conference illustrations in a responsive grid,
 * with a back-home link and an invitation to get in touch.
 *
 * Stories render the real `sketchnotes.html` markup.
 */
const meta: Meta = {
	title: 'Views/Sketchnotes',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'The gallery is `repeat(auto-fit, minmax(300px, 1fr))`, so the column count follows the viewport with no breakpoints of its own.',
			},
		},
	},
	render: () => renderPage(page, css),
}

export default meta
type Story = StoryObj

/** The full gallery at desktop width — three columns. */
export const Desktop: Story = {
	play: async ({ canvasElement }) => {
		const figures = canvasElement.querySelectorAll('figure')
		await expect(figures).toHaveLength(12)
		await expect(canvasElement.querySelectorAll('figcaption')).toHaveLength(12)
	},
}

/** Single column on a phone. */
export const Mobile: Story = {
	globals: { viewport: { value: 'mobile1' } },
}

/** Two columns at tablet width, from the same auto-fit track. */
export const Tablet: Story = {
	globals: { viewport: { value: 'tablet' } },
}

/** The back-home link — the page's only way out. */
export const BackHomeLink: Story = {
	render: () => renderSection(page, css, '.site-nav'),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const link = canvas.getByRole('link', { name: /back home/i })
		await expect(link).toHaveAttribute('href', '/')
	},
}

/** The intro, including the email and Twitter contact links. */
export const Intro: Story = {
	render: () => renderPage(page, css),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		await expect(canvas.getByRole('heading', { name: 'Sketchnoting!' })).toBeInTheDocument()
		await expect(canvas.getByRole('link', { name: 'email' })).toHaveAttribute(
			'href',
			'mailto:natalyathree@gmail.com',
		)
	},
}

/** Every sketchnote carries descriptive alt text. */
export const ImageAltText: Story = {
	play: async ({ canvasElement }) => {
		const images = [...canvasElement.querySelectorAll('img')]
		await expect(images).toHaveLength(12)
		await expect(images.every((img) => (img.getAttribute('alt') ?? '').length > 0)).toBe(true)
	},
}
