import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { expect } from 'storybook/test'
import './background-shards'
import { bodyOf, styleElement } from '../story-utils'
import page from 'virtual:page/index.html'
import homeCss from '../styles/home.css?inline'

/**
 * `<background-shards>` scatters the decorative shard artwork behind the home
 * page, setting `--shard-top` / `--shard-left` / `--shard-width` on each shard
 * at connect time so the composition is different on every load.
 *
 * The SVG artwork is slotted light-DOM content and is never modified. The
 * stories take it straight out of the shipped home page markup (Vite refuses
 * JS imports of `public/` assets, and this can't drift from the page anyway).
 * Template content stays inert, so extracting it upgrades nothing early.
 */
const shardsSvg = (() => {
	const template = document.createElement('template')
	template.innerHTML = bodyOf(page)
	return template.content.querySelector('background-shards')!.innerHTML
})()
const meta: Meta = {
	title: 'Components/BackgroundShards',
	component: 'background-shards',
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component:
					'Placement ranges: shard 1 top 1–5% / width 4–2080px; shards 2–4 width 12–1440px; shard 3 is pinned to the top. All four are positioned 1–40% from the left.',
			},
		},
	},
	decorators: [
		(story) => html`
			${styleElement(homeCss)}
			<!-- No background here: the shards sit at z-index -2, so any background
			     on this wrapper would paint straight over them. -->
			<div style="position: relative; height: 60vh; overflow: hidden;">
				${story()}
			</div>
		`,
	],
}

export default meta
type Story = StoryObj

/** All four shards, placed randomly — reload the story to reshuffle. */
export const Default: Story = {
	render: () => html`<background-shards aria-hidden="true">${unsafeHTML(shardsSvg)}</background-shards>`,
	play: async ({ canvasElement }) => {
		const shard = canvasElement.querySelector<SVGElement>('.shard1')!
		// Every randomised property must be applied inline at connect time.
		await expect(shard.style.getPropertyValue('--shard-left')).toMatch(/^\d+%$/)
		await expect(shard.style.getPropertyValue('--shard-width')).toMatch(/^\d+px$/)
		await expect(shard.style.getPropertyValue('--shard-top')).toMatch(/^\d+%$/)
	},
}

/** Shard 3 is pinned to the top edge, so it never receives `--shard-top`. */
export const TopPinnedShard: Story = {
	render: () => html`<background-shards aria-hidden="true">${unsafeHTML(shardsSvg)}</background-shards>`,
	play: async ({ canvasElement }) => {
		const shard = canvasElement.querySelector<SVGElement>('.shard3')!
		await expect(shard.style.getPropertyValue('--shard-top')).toBe('')
		await expect(getComputedStyle(shard).top).toBe('0px')
	},
}

/** Each shard carries its own fill token, darkest at the back of the stack. */
export const FillPalette: Story = {
	render: () => html`<background-shards aria-hidden="true">${unsafeHTML(shardsSvg)}</background-shards>`,
	play: async ({ canvasElement }) => {
		const fills = ['.shard1', '.shard2', '.shard3', '.shard4'].map((sel) => {
			const polygon = canvasElement.querySelector(`${sel} polygon`)!
			return getComputedStyle(polygon).fill
		})
		await expect(new Set(fills).size).toBe(4)
	},
}

/**
 * Without the custom element the shards still render, falling back to the
 * default placement baked into the CSS — the page degrades gracefully.
 */
export const CssFallbackPlacement: Story = {
	render: () => html`
		<div style="position: absolute; inset: 0;">${unsafeHTML(shardsSvg)}</div>
	`,
	play: async ({ canvasElement }) => {
		const shard = canvasElement.querySelector<SVGElement>('.shard1')!
		await expect(shard.style.getPropertyValue('--shard-width')).toBe('')
		// falls back to the 1040px default declared in home.css
		await expect(getComputedStyle(shard).width).toBe('1040px')
	},
}

/** A single shard, to inspect one piece of the artwork on its own. */
export const SingleShard: Story = {
	render: () => {
		const firstSvg = shardsSvg.slice(shardsSvg.indexOf('<svg'), shardsSvg.indexOf('</svg>') + 6)
		return html`<background-shards aria-hidden="true">${unsafeHTML(firstSvg)}</background-shards>`
	},
}
