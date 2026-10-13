# wasmUrl load-order repro

Reproduces the issue the SciChart.JS.Examples site worked around in
[3a6696f — update to scichart 6.0.6](https://github.com/ABTSoftware/SciChart.JS.Examples/commit/3a6696f079fe81b4786b4a5f28cc0e1145b2b9a2):
scichart-react applies `SciChartSurface.configure({ wasmUrl: "/scichart.wasm" })` when its
`configureDefaults` module is evaluated, and in a code-split app that can happen *after* the app's
own `configure` call, overwriting it.

The app is served under `/demo/` (like the Examples site in production) and configures
`wasmUrl: "/demo/scichart.wasm"`. Its only eager import from `scichart-react` is `SciChartGroup`;
the chart component is loaded through a synchronous `require.context`, evaluated after the app's
module body. `scichart-react` and `scichart` come from npm, not from this repo's `lib/`.

```
npm install
npm run build          # broken variant
npm start              # http://127.0.0.1:8090/demo/
```

Expected: `wasmUrl: /scichart.wasm`, a 404 for `/scichart.wasm`, the chart never renders.

```
npm run build:fixed    # adds `import "scichart-react/configureDefaults"` before the app's configure
```

Expected: `wasmUrl: /demo/scichart.wasm`, the chart renders.
