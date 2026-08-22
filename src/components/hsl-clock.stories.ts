import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, waitFor } from 'storybook/test'
import './hsl-clock'
import type { HslClock } from './hsl-clock'

/**
 * `<hsl-clock>` is an analog clock whose border hue tracks the second hand —
 * 360° of hue mapped onto 60 seconds, so hsl() reads like a clock face.
 *
 * Leave `time` unset for a live clock; set it to pin the clock to a moment.
 */
const meta: Meta = {
	title: 'Components/HslClock',
	component: 'hsl-clock',
	tags: ['autodocs'],
	argTypes: {
		time: {
			control: 'date',
			description: 'Pin the clock to a fixed time. Unset = follows the system clock.',
		},
	},
	render: ({ time }) => html`<hsl-clock .time=${time ? new Date(time) : undefined}></hsl-clock>`,
	parameters: {
		docs: {
			description: {
				component:
					'Hand angles are offset by 90° because the hands start pointing right. The border colour is hsla(<seconds as degrees>, 90%, 45%, 1).',
			},
		},
	},
}

export default meta
type Story = StoryObj

const at = (h: number, m: number, s: number): Date => new Date(2026, 0, 1, h, m, s)

/** Follows the system clock, ticking once a second. */
export const Live: Story = {
	args: { time: undefined },
	play: async ({ canvasElement }) => {
		const clock = canvasElement.querySelector<HslClock>('hsl-clock')!
		const hand = () =>
			clock.shadowRoot!.querySelectorAll<HTMLElement>('.hand')[2]!.style.transform
		const first = hand()
		await waitFor(() => expect(hand()).not.toBe(first), { timeout: 3000 })
	},
}

/** Midnight — every hand at 12, hue at 0° (red). */
export const Midnight: Story = {
	args: { time: at(0, 0, 0) },
	play: async ({ canvasElement }) => {
		const clock = canvasElement.querySelector<HslClock>('hsl-clock')!
		const hands = clock.shadowRoot!.querySelectorAll<HTMLElement>('.hand')
		await expect(hands[2]!.style.transform).toBe('rotate(90deg)')
		await expect(hands[1]!.style.transform).toBe('rotate(90deg)')
	},
}

/** Quarter past — second hand at 15s drives the hue a quarter of the way round. */
export const QuarterPast: Story = {
	args: { time: at(3, 15, 15) },
	play: async ({ canvasElement }) => {
		const clock = canvasElement.querySelector<HslClock>('hsl-clock')!
		const face = clock.shadowRoot!.querySelector<HTMLElement>('.clock')!
		// 15s of 60 = 90° of hue
		await expect(face.style.getPropertyValue('--second-degrees')).toBe('90')
	},
}

/** Half past — hue at 180°, the complement of the 0-second colour. */
export const HalfPast: Story = {
	args: { time: at(6, 30, 30) },
	play: async ({ canvasElement }) => {
		const clock = canvasElement.querySelector<HslClock>('hsl-clock')!
		const face = clock.shadowRoot!.querySelector<HTMLElement>('.clock')!
		await expect(face.style.getPropertyValue('--second-degrees')).toBe('180')
	},
}

/** Late in the minute — hue swings back toward red. */
export const NearlyTheMinute: Story = {
	args: { time: at(23, 59, 55) },
}

/** The full hue sweep: one clock every ten seconds of the minute. */
export const HueSweep: Story = {
	render: () => html`
		<div style="display: flex; flex-wrap: wrap; gap: 1rem; --size-clock: 12rem;">
			${[0, 10, 20, 30, 40, 50].map(
				(seconds) => html`<hsl-clock .time=${at(10, 10, seconds)}></hsl-clock>`,
			)}
		</div>
	`,
}

/** The clock scales from the `--size-clock` token — nothing is hard-coded. */
export const Compact: Story = {
	args: { time: at(9, 41, 20) },
	render: ({ time }) =>
		html`<div style="--size-clock: 10rem;">
			<hsl-clock .time=${time ? new Date(time) : undefined}></hsl-clock>
		</div>`,
}
