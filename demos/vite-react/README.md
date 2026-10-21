# scichart-react on Vite + React 19

A client-only single-page app with both ways to create a chart in `scichart-react`, side by side in
[`src/App.tsx`](./src/App.tsx):

| Component             | Prop        | What it shows                                                                               |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `SciChartReact`       | `initChart` | A line chart built imperatively from SciChart.js classes. Smallest bundle.                  |
| `SciChartDeclarative` | `config`    | A mountain chart from a Builder API definition. Adds about 200 KB gzip for the Builder API. |

Start here if you are new to `scichart-react`: there is no server rendering, so the chart components
mount like any other React component.

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
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
```

`dev` and `build` first copy SciChart's WebAssembly files from `node_modules/scichart/_wasm/` into `public/`
(`scripts/copy-wasm.mjs`). The browser loads them from `/scichart.wasm`, the default location
`scichart-react` configures.

## Worth knowing

-   `vite.config.ts` sets `resolve.dedupe` for `scichart`, `react` and `react-dom`. Because the wrapper is
    linked from `../../lib`, Vite would otherwise resolve its imports from the repository root and bundle a
    second copy of SciChart.js and React. An app that installs `scichart-react` from npm does not need this.
-   Both examples handle `onInitError`, so a chart that fails to start (for example because the wasm file is
    not served) shows the error instead of a fallback that never goes away.
