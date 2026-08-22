import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, userEvent, waitFor } from 'storybook/test'
import './demo-nav'

/**
 * `<demo-nav>` gives the demos page keyboard navigation: **Ctrl+Space** moves
 * the `active` class to the next `.demo-item` and scrolls it into view,
 * wrapping around at the end.
 *
 * It renders into light DOM — the articles are page content, not component
 * internals.
 */
const meta: Meta = {
	title: 'Components/DemoNav',
	component: 'demo-nav',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Press Ctrl+Space inside the preview to advance. The listener is bound on `document` while connected and removed on disconnect.',
			},
		},
	},
}

export default meta
type Story = StoryObj

const itemStyle = (label: string) => html`
	<article class="demo-item" data-label=${label} style="min-height: 8rem; padding: 1rem;">
		<h1 style="color: white; font-family: var(--font-demos);">${label}</h1>
	</article>
`

const activeItemStyle = (label: string) => html`
	<article class="demo-item active" data-label=${label} style="min-height: 8rem; padding: 1rem;">
		<h1 style="color: white; font-family: var(--font-demos);">${label}</h1>
	</article>
`

/** Only `.active` styling differs; here the first item starts active. */
export const Default: Story = {
	render: () => html`
		<style>
			.demo-item {
				border: 1px dashed var(--color-complementary-neutral-dark);
			}
			.demo-item.active {
				outline: 2px solid var(--color-complementary);
			}
		</style>
		<demo-nav>
			${activeItemStyle('HSL Clock')} ${itemStyle('Value Scales')} ${itemStyle('Gem')}
		</demo-nav>
	`,
	play: async ({ canvasElement }) => {
		const active = canvasElement.querySelector('.demo-item.active')!
		await expect(active.getAttribute('data-label')).toBe('HSL Clock')
	},
}

/** Ctrl+Space advances to the next item. */
export const AdvancesOnCtrlSpace: Story = {
	...Default,
	play: async ({ canvasElement }) => {
		await userEvent.keyboard('{Control>} {/Control}')
		await waitFor(async () => {
			const active = canvasElement.querySelector('.demo-item.active')!
			await expect(active.getAttribute('data-label')).toBe('Value Scales')
		})
	},
}

/** Advancing past the last item wraps back to the first. */
export const WrapsAtTheEnd: Story = {
	...Default,
	play: async ({ canvasElement }) => {
		for (let i = 0; i < 3; i++) {
			await userEvent.keyboard('{Control>} {/Control}')
		}
		await waitFor(async () => {
			const active = canvasElement.querySelector('.demo-item.active')!
			await expect(active.getAttribute('data-label')).toBe('HSL Clock')
		})
	},
}

/** Space without Ctrl is ignored, so normal typing and scrolling still work. */
export const IgnoresPlainSpace: Story = {
	...Default,
	play: async ({ canvasElement }) => {
		await userEvent.keyboard(' ')
		const active = canvasElement.querySelector('.demo-item.active')!
		await expect(active.getAttribute('data-label')).toBe('HSL Clock')
	},
}

/** A single item stays active when advanced — nothing to move to. */
export const SingleItem: Story = {
	render: () => html`
		<demo-nav>${activeItemStyle('Only Demo')}</demo-nav>
	`,
	play: async ({ canvasElement }) => {
		await userEvent.keyboard('{Control>} {/Control}')
		await waitFor(async () => {
			const active = canvasElement.querySelector('.demo-item.active')!
			await expect(active.getAttribute('data-label')).toBe('Only Demo')
		})
	},
}

/** With nothing marked active the component simply does nothing (no crash). */
export const NoActiveItem: Story = {
	render: () => html`
		<demo-nav>${itemStyle('First')} ${itemStyle('Second')}</demo-nav>
	`,
	play: async ({ canvasElement }) => {
		await userEvent.keyboard('{Control>} {/Control}')
		await expect(canvasElement.querySelector('.demo-item.active')).toBeNull()
	},
}
