import { LitElement } from 'lit'

/**
 * <demo-nav> — Ctrl+Space cycles through the slotted .demo-item articles,
 * scrolling the newly active one into view. Faithful port of the original
 * demos.js navigation.
 */
export class DemoNav extends LitElement {
	// Light DOM: the demo articles are page content styled by demos.css.
	protected override createRenderRoot(): HTMLElement {
		return this
	}

	private readonly onKeyup = (event: KeyboardEvent): void => {
		if (!(event.ctrlKey && event.key === ' ')) return
		event.preventDefault()

		const active = this.querySelector('.demo-item.active')
		if (!active) return
		active.classList.remove('active')

		const next = active.nextElementSibling ?? this.querySelector('.demo-item')
		if (!next) return
		next.classList.add('active')
		next.scrollIntoView()
	}

	override connectedCallback(): void {
		super.connectedCallback()
		document.addEventListener('keyup', this.onKeyup)
	}

	override disconnectedCallback(): void {
		document.removeEventListener('keyup', this.onKeyup)
		super.disconnectedCallback()
	}
}

customElements.define('demo-nav', DemoNav)
