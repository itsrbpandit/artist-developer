import type { Preview } from '@storybook/web-components-vite'

// Design tokens and the global reset back every story, exactly as they back
// every page of the site.
import '../src/styles/tokens.css'
import '../src/styles/base.css'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		backgrounds: {
			options: {
				site: { name: 'Site dark', value: '#222' },
				light: { name: 'Light', value: '#ffffff' },
			},
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo',
		},
	},

	initialGlobals: {
		backgrounds: { value: 'site' },
	},
}

export default preview
