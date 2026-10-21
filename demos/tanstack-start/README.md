# scichart-react on TanStack Start (server rendering)

A server-rendered TanStack Start app with React 19 and both `scichart-react` components on one page
([`src/routes/index.tsx`](./src/routes/index.tsx)): `SciChartReact` with `initChart`, and
`SciChartDeclarative` with a Builder API `config`.

The page is rendered on the server; the charts are not, because SciChart.js needs a real DOM element, WebGL
and WebAssembly. [`src/components/ClientOnlyCharts.tsx`](./src/components/ClientOnlyCharts.tsx) does that in
two layers:

1. `React.lazy(() => import(...))` keeps `scichart` and `scichart-react` out of the server module graph. The
   chart code is only fetched in the browser.
2. TanStack Router's `<ClientOnly>` renders a placeholder on the server and during the first client render,
   so hydration matches, and mounts the chart afterwards.

If a whole page needs the browser, the route can opt out of server rendering instead:
`createFileRoute("/")({ ssr: false, component: HomePage })`.

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
npm run build      # production build
npm run preview    # serve the production build on http://localhost:4173
npm run typecheck
```

`dev` and `build` first copy SciChart's WebAssembly files from `node_modules/scichart/_wasm/` into `public/`
(`scripts/copy-wasm.mjs`). The browser loads them from `/scichart.wasm`, the default location
`scichart-react` configures.

`vite.config.ts` sets `resolve.dedupe` because the wrapper is linked from `../../lib`; without it a second
copy of SciChart.js and React would be bundled. An app that installs `scichart-react` from npm does not need
this.
