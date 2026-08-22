import { LitElement, html, css } from 'lit'
import type { TemplateResult } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'

/**
 * <hsl-clock> — the analog clock whose border hue tracks the second hand,
 * demonstrating that hsl() hue angles read like a clock face.
 *
 * TypeScript port of the original demos.js clock (itself inspired by Wes Bos /
 * JavaScript30 — https://github.com/wesbos/JavaScript30/tree/master/02%20-%20JS%20and%20CSS%20Clock).
 */

const SECONDS_ON_FACE = 60
const MINUTES_ON_FACE = 60
const HOURS_ON_FACE = 12
const DEGS_IN_CIRCLE = 360
const DEGS_PER_MINUTE = DEGS_IN_CIRCLE / MINUTES_ON_FACE
const DEGS_PER_HOUR = DEGS_IN_CIRCLE / HOURS_ON_FACE

const TICK_MS = 1000

export class HslClock extends LitElement {
	static override properties = {
		time: { attribute: false },
		secondsDegrees: { state: true },
		minsDegrees: { state: true },
		hourDegrees: { state: true },
	}

	/**
	 * Freezes the clock at a fixed time instead of following the system clock.
	 * Left undefined in the app; set it to pin the clock (tests, stories).
	 */
	declare time: Date | undefined

	declare private secondsDegrees: number
	declare private minsDegrees: number
	declare private hourDegrees: number

	private intervalId: number | undefined

	static override styles = css`
		:host {
			display: block;
		}

		.clock {
			width: var(--size-clock, 25rem);
			height: var(--size-clock, 25rem);
			border: 20px solid hsla(var(--second-degrees), 90%, 45%, 1);
			border-radius: 50%;
			margin: 50px auto;
			position: relative;
			padding: 2rem;
			box-shadow:
				0 0 0 4px rgba(0, 0, 0, 0.1),
				inset 0 0 0 3px var(--color-off-white, #efefef),
				inset 0 0 10px var(--black, black),
				0 0 10px rgba(0, 0, 0, 0.2);
		}

		.clock-face {
			position: relative;
			width: 100%;
			height: 100%;
			transform: translateY(-3px); /* account for the height of the clock hands */
		}

		.hand {
			width: 50%;
			height: 6px;
			background: var(--white, white);
			position: absolute;
			top: 50%;
			transform-origin: 100%;
			transform: rotate(90deg);
			transition: all var(--duration-hand, 0.05s);
			transition-timing-function: var(--ease-hand, cubic-bezier(0.1, 2.7, 0.58, 1));
		}
	`

	constructor() {
		super()
		this.secondsDegrees = 90
		this.minsDegrees = 90
		this.hourDegrees = 90
		this.tick()
	}

	override connectedCallback(): void {
		super.connectedCallback()
		this.tick()
		// A pinned clock has nothing to advance.
		if (this.time === undefined) {
			this.intervalId = window.setInterval(() => this.tick(), TICK_MS)
		}
	}

	override disconnectedCallback(): void {
		this.stopTicking()
		super.disconnectedCallback()
	}

	/** `time` may be assigned after connection (Lit sets properties post-append). */
	protected override willUpdate(changed: Map<string, unknown>): void {
		if (!changed.has('time')) return
		if (this.time === undefined) {
			if (this.isConnected && this.intervalId === undefined) {
				this.intervalId = window.setInterval(() => this.tick(), TICK_MS)
			}
		} else {
			this.stopTicking()
		}
		this.tick()
	}

	private stopTicking(): void {
		window.clearInterval(this.intervalId)
		this.intervalId = undefined
	}

	/** Recomputes the hand angles from `time`, or from the system clock. */
	private tick(): void {
		const date = this.time ?? new Date()
		const [hour, mins, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()]

		this.secondsDegrees = ((seconds / SECONDS_ON_FACE) * DEGS_IN_CIRCLE) + 90
		this.minsDegrees = ((mins / MINUTES_ON_FACE) * DEGS_IN_CIRCLE) + ((seconds / SECONDS_ON_FACE) * DEGS_PER_MINUTE) + 90
		this.hourDegrees = ((hour / HOURS_ON_FACE) * DEGS_IN_CIRCLE) + ((mins / MINUTES_ON_FACE) * DEGS_PER_HOUR) + 90
	}

	override render(): TemplateResult {
		return html`
			<div class="clock" style=${styleMap({ '--second-degrees': String(this.secondsDegrees - 90) })}>
				<div class="clock-face">
					<div class="hand" style=${styleMap({ transform: `rotate(${this.hourDegrees}deg)` })}></div>
					<div class="hand" style=${styleMap({ transform: `rotate(${this.minsDegrees}deg)` })}></div>
					<div class="hand" style=${styleMap({ transform: `rotate(${this.secondsDegrees}deg)` })}></div>
				</div>
			</div>
		`
	}
}

customElements.define('hsl-clock', HslClock)
