import { LitElement, html, css } from 'lit'
import type { TemplateResult } from 'lit'

/**
 * <value-scale variant="lightness | saturation | hue"> — renders the eleven
 * hsl() swatches of a value scale. The heading stays in the page as slotted
 * light-DOM content; only the presentational swatches are generated.
 *
 * The exact hsl() steps are those of the original hand-written
 * .value-scale / .saturation-value-scale / .color-value-scale rules.
 */

type Variant = 'lightness' | 'saturation' | 'hue'

interface Swatch {
	readonly h: number
	readonly s: number
	readonly l: number
}

/** Hue scale steps are irregular by design: (hue, lightness) per swatch. */
const HUE_STEPS: ReadonlyArray<readonly [number, number]> = [
	[0, 0], [30, 10], [60, 20], [90, 30], [120, 40], [160, 50],
	[190, 60], [220, 70], [260, 80], [290, 90], [330, 100],
]

const SCALES: Record<Variant, readonly Swatch[]> = {
	lightness: Array.from({ length: 11 }, (_, i) => ({ h: 0, s: 0, l: i * 10 })),
	saturation: Array.from({ length: 11 }, (_, i) => ({ h: 0, s: 100, l: i * 10 })),
	hue: HUE_STEPS.map(([h, l]) => ({ h, s: 100, l })),
}

const isVariant = (value: string): value is Variant => value in SCALES

export class ValueScale extends LitElement {
	static override properties = {
		variant: { type: String },
	}

	declare variant: string

	static override styles = css`
		:host {
			display: block;
		}

		.swatch {
			height: 77px;
			width: calc(8vw - 11px);
			margin-right: 5px;
			display: inline-block;
			border: 1px solid var(--color-off-white, #efefef);
		}
	`

	constructor() {
		super()
		this.variant = 'lightness'
	}

	override render(): TemplateResult {
		const swatches = isVariant(this.variant) ? SCALES[this.variant] : SCALES.lightness
		// The trailing newline inside the repeated template keeps whitespace
		// between the inline-block swatches, matching the original markup.
		return html`<slot></slot>
${swatches.map(({ h, s, l }) => html`<div class="swatch" style="background-color: hsl(${h}, ${s}%, ${l}%)"></div>
`)}`
	}
}

customElements.define('value-scale', ValueScale)
