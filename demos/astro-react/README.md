# scichart-react on Astro (React islands)

A static [Astro](https://astro.build) page with two SciChart.js charts as React 19 islands:

-   [`src/components/InitChartIsland.tsx`](./src/components/InitChartIsland.tsx): `SciChartReact` with an
    `initChart` function.
-   [`src/components/DeclarativeChartIsland.tsx`](./src/components/DeclarativeChartIsland.tsx):
    `SciChartDeclarative` with a Builder API `config`.
-   [`src/pages/index.astro`](./src/pages/index.astro): the page that mounts both.

The islands use `client:only="react"`. The other directives (`client:load`, `client:visible`, ...) still
render the component on the server first, which a WebGL/WebAssembly chart cannot do. Each island sits in a
`.chart-frame` element that is part of the static HTML, so the page reserves the chart's space before any
JavaScript runs.

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
npm run dev        # http://localhost:4321
npm run build      # static build into dist/
npm run preview    # serve dist/ on http://localhost:4321
npm run check      # astro check (types for .astro and .tsx)
```

`dev`, `build` and `check` first copy SciChart's WebAssembly files from `node_modules/scichart/_wasm/` into
`public/` (`scripts/copy-wasm.mjs`). The browser loads them from `/scichart.wasm`, the default location
`scichart-react` configures.

## Worth knowing

-   Astro 7 can run `astro dev` as a background server. If `npm run dev` returns straight away, the server is
    still running: `npx astro dev status` shows it and `npx astro dev stop` stops it.
-   `astro.config.mjs` sets `vite.resolve.dedupe` because the wrapper is linked from `../../lib`; without it
    a second copy of SciChart.js would be bundled. An app that installs `scichart-react` from npm does not
    need this.
