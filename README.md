# Artist-Developer Website

Portfolio site for Natalya Shelburne — designer, developer, artist, author, and educator.

Built on a web-standards stack:

- **Node + Vite** — dev server and multi-page build (dev-only tooling)
- **TypeScript (strict)** — all behavior
- **Lit** — the only runtime library, used solely for behavioral web components
- **Semantic HTML** — all content lives as plain light-DOM markup
- **Pure CSS with custom properties** — no preprocessor; design tokens in one file

## Setup & development

```sh
npm install
npm run dev        # dev server with HMR
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit

npm run storybook        # component/view workshop at localhost:6006
npm run build-storybook  # static Storybook to storybook-static/
npx vitest run           # runs every story (and its assertions) in a headless browser
```