# scichart-react on React Router (framework mode, server rendering)

A server-rendered React Router app with React 19. The pages are rendered on the server; the charts are not,
because SciChart.js needs a real DOM element, WebGL and WebAssembly. The demo shows two ways to keep a chart
out of the server render:

| Route          | Component             | How the chart is kept client-only                                                                                           |
| -------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `/`            | `SciChartReact`       | A `<ClientOnly>` wrapper ([`app/components/ClientOnly.tsx`](./app/components/ClientOnly.tsx)) that renders after hydration. |
| `/declarative` | `SciChartDeclarative` | A route `clientLoader` with a `HydrateFallback`, so the whole route renders in the browser.                                 |

On both routes the chart module is loaded with `React.lazy(() => import(...))`. That part is required, not
an optimisation: React Router evaluates every route module on the server, and a static import of `scichart`
would make the server load SciChart.js's browser-only ESM build and fail on startup.

Server rendering stays on (`ssr: true` in `react-router.config.ts`) on purpose. Turning it off would avoid
the problem rather than show how to handle it.

## Running

The demo uses the repository's own build of the wrapper (`"scichart-react": "file:../../lib"`), so build it
first from the repository root:

```bash
npm install
npm run build
```

Then, in this folder:

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into build/
npm run start      # serve the production build on http://localhost:3000
npm run typecheck
```

`dev` and `build` first copy SciChart's WebAssembly files from `node_modules/scichart/_wasm/` into `public/`
(`scripts/copy-wasm.mjs`). The browser loads them from `/scichart.wasm`, the default location
`scichart-react` configures.

`vite.config.ts` sets `resolve.dedupe` because the wrapper is linked from `../../lib`; without it a second
copy of SciChart.js and React would be bundled. An app that installs `scichart-react` from npm does not need
this.
