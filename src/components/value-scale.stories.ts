import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect } from 'storybook/test'
import './value-scale'

/**
 * `<value-scale>` renders the eleven hsl() swatches of a colour-theory value
 * scale. The heading is slotted light-DOM content; only the swatches are
 * generated, from the `variant` attribute.
 */
const meta: Meta = {
	title: 'Components/ValueScale',
	component: 'value-scale',
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['lightness', 'saturation', 'hue'],
			description: 'Which of the three scales to render.',
		},
	},
	args: { variant: 'lightness' },
	render: ({ variant, heading }) => html`
		<value-scale variant=${variant}>
			<h2 class="scale-heading" style="color: var(--color-off-white); font-size: 16px;">${heading}</h2>
		</value-scale>
	`,
	parameters: {
		docs: {
			description: {
				component:
					'Swatch colours are generated from the variant: lightness sweeps L at 0% saturation, saturation sweeps L at 100% saturation, and hue sweeps hue and lightness together.',
			},
		},
	},
}

export default meta
type Story = StoryObj

/** L from 0–100% at 0% saturation: the value scale that underpins contrast. */
export const Lightness: Story = {
	args: { variant: 'lightness', heading: 'Lightness' },
	play: async ({ canvasElement }) => {
		const scale = canvasElement.querySelector('value-scale')!
		const swatches = scale.shadowRoot!.querySelectorAll<HTMLElement>('.swatch')
		await expect(swatches).toHaveLength(11)
		await expect(swatches[0]!.style.backgroundColor).toBe('rgb(0, 0, 0)')
		await expect(swatches[10]!.style.backgroundColor).toBe('rgb(255, 255, 255)')
	},
}

/** The same lightness sweep at full saturation — pure red at the midpoint. */
export const Saturation: Story = {
	args: { variant: 'saturation', heading: 'Lightness & Saturation' },
	play: async ({ canvasElement }) => {
		const scale = canvasElement.querySelector('value-scale')!
		const swatches = scale.shadowRoot!.querySelectorAll<HTMLElement>('.swatch')
		// The midpoint is the "reddest red": hsl(0, 100%, 50%)
		await expect(swatches[5]!.style.backgroundColor).toBe('rgb(255, 0, 0)')
	},
}

/** Hue and lightness advancing together — value gets harder to judge. */
export const Hue: Story = {
	args: { variant: 'hue', heading: 'Lightness, Saturation, and Hue' },
	play: async ({ canvasElement }) => {
		const scale = canvasElement.querySelector('value-scale')!
		const swatches = scale.shadowRoot!.querySelectorAll<HTMLElement>('.swatch')
		await expect(swatches[5]!.style.backgroundColor).toBe('rgb(0, 255, 170)')
	},
}

/** An unknown variant falls back to the lightness scale rather than rendering empty. */
export const UnknownVariantFallsBack: Story = {
	args: { variant: 'not-a-scale', heading: 'Unknown variant' },
	play: async ({ canvasElement }) => {
		const scale = canvasElement.querySelector('value-scale')!
		const swatches = scale.shadowRoot!.querySelectorAll<HTMLElement>('.swatch')
		await expect(swatches).toHaveLength(11)
		await expect(swatches[10]!.style.backgroundColor).toBe('rgb(255, 255, 255)')
	},
}

/** With no heading slotted, the swatches still render on their own. */
export const WithoutHeading: Story = {
	render: () => html`<value-scale variant="lightness"></value-scale>`,
}

/** All three scales stacked, as they appear on the demos page. */
export const AllScales: Story = {
	render: () => html`
		${['lightness', 'saturation', 'hue'].map(
			(variant) => html`
				<value-scale variant=${variant}>
					<h2 style="color: var(--color-off-white); font-size: 16px;">${variant}</h2>
				</value-scale>
			`,
		)}
	`,
}
