import { LitElement } from 'lit'

/**
 * <background-shards> — decorates the inline background-shard SVGs with random
 * placement and sizing.
 *
 * The original site randomized these values at compile time with Sass random()
 * ("vector self portrait that alternates … randomly at every compile"); this
 * reproduces the same ranges at runtime via CSS custom properties. The SVG
 * markup itself is untouched — it is slotted in as light-DOM children.
 *
 * Original Sass ranges (random(n) is a uniform integer in 1..n):
 *   .shard1  top: random(5)*1%   left: random(40)*1%   width: random(520)*4px
 *   .shard2  top: random(5)*1%   left: random(40)*1%   width: random(120)*12px
 *   .shard3  top: 0              left: random(40)*1%   width: random(120)*12px
 *   .shard4  top: random(10)*1%  left: random(40)*1%   width: random(120)*12px
 */

interface ShardRange {
	readonly selector: string
	/** upper bound for top in %, or null when top is fixed in CSS */
	readonly topMax: number | null
	readonly widthMax: number
	readonly widthUnit: number
}

const SHARD_RANGES: readonly ShardRange[] = [
	{ selector: '.shard1', topMax: 5, widthMax: 520, widthUnit: 4 },
	{ selector: '.shard2', topMax: 5, widthMax: 120, widthUnit: 12 },
	{ selector: '.shard3', topMax: null, widthMax: 120, widthUnit: 12 },
	{ selector: '.shard4', topMax: 10, widthMax: 120, widthUnit: 12 },
]

/** Uniform integer in 1..max, matching Sass random(max). */
const randomInt = (max: number): number => Math.floor(Math.random() * max) + 1

export class BackgroundShards extends LitElement {
	// Light DOM: the shard SVGs are page content styled by home.css.
	protected override createRenderRoot(): HTMLElement {
		return this
	}

	override connectedCallback(): void {
		super.connectedCallback()
		this.scatter()
	}

	private scatter(): void {
		for (const { selector, topMax, widthMax, widthUnit } of SHARD_RANGES) {
			const shard = this.querySelector<SVGElement>(selector)
			if (!shard) continue
			if (topMax !== null) {
				shard.style.setProperty('--shard-top', `${randomInt(topMax)}%`)
			}
			shard.style.setProperty('--shard-left', `${randomInt(40)}%`)
			shard.style.setProperty('--shard-width', `${randomInt(widthMax) * widthUnit}px`)
		}
	}
}

customElements.define('background-shards', BackgroundShards)
