# bundle-check — tree-shaking scenarios & bundle-size tracking

Comparison tests for the published `scichart-react` artifact (`lib/`).
Never published; `scichart-react` is consumed as `file:../lib`, so run `npm run build` at the
repo root first.

## Running

```bash
npm run bundleCheck        # from the repo root: install + full measure
# or, from this folder:
npm install
npm run measure            # build (4 bundlers) + snapshotSizes + assertBundles + compareSizes
npm run updateBaseline     # accept size changes -> baseline/sizes.json (review + commit)
```

Per-bundler builds are also available: `buildWebpack`, `buildRollup`, `buildEsbuild`, `buildVite`.

## The matrix

Every scenario in [scenarios.ts](./scenarios.ts) is one entry module in `scenarios/` built by all
four bundlers (webpack 5, Rollup 4, esbuild, Vite 5). Ordered smallest → largest:

| Scenario | What it proves |
|---|---|
| `typesOnly` | Harness floor — types erase to ~0.1 KB |
| `reactBaseline` | The React floor; subtract from other rows to see the scichart cost alone |
| `groupOnly` | Barrel-skip probe: `SciChartGroup` from the barrel |
| `groupOnlyDeepImport` | Same via `scichart-react/SciChartGroup` — the rollup-family workaround |
| `initChartOnly` | Headline: `SciChartReact` + minimal line chart, no Builder |
| `nestedOverview` | Delta vs `initChartOnly` = overview cost through the wrapper |
| `declarative` | `SciChartDeclarative`, which calls `registerAllTypes()`. Delta vs `initChartOnly` = the whole Builder API cost |
| `fullImport` | Upper bound: entire barrel kept alive |
| `cjsRequireBaseline` | webpack-only control: same code resolved through the `require` condition (pre-2.0 consumer) |

## Baseline results (gzip KB, scichart-react 2.0.0-alpha.0 / scichart 6.0.0-alpha.162)

| Scenario | webpack | rollup | esbuild | vite |
|---|---:|---:|---:|---:|
| typesOnly | 0.1 | 0.1 | 0.1 | 0.1 |
| reactBaseline | 44.0 | 44.2 | 44.5 | 44.3 |
| groupOnly | **44.3** | 399.5 | 181.0 | **44.6** |
| groupOnlyDeepImport | 44.3 | **47.1** | **44.9** | 44.6 |
| initChartOnly | **209.8** | 752.9 | 217.7 | 212.3 |
| nestedOverview | 238.5 | 754.1 | 245.7 | 240.3 |
| declarative | 413.9 | 419.2 | 423.5 | 416.3 |
| fullImport | 415.8 | 421.2 | 425.6 | 418.3 |
| cjsRequireBaseline | 516.1 | — | — | — |

Headline readings (webpack, the barrel-skipping bundler):

- **ESM vs CJS**: `initChartOnly` 209.8 KB vs `cjsRequireBaseline` 516.1 KB — **−59 %** for identical app code.
- **Component split works**: `declarative` − `initChartOnly` = **+204 KB** Builder cost paid only by `config` users.
- **Registration is the bulk of it**: most of that +204 KB is `registerAllTypes()`, which `SciChartDeclarative` calls so any definition works with no setup.
- **sideEffects allowlist works**: `groupOnly` − `reactBaseline` = **0.3 KB** — a group-only consumer bundles no scichart at all.
- **Rollup-family caveat**: without barrel-skipping, a barrel import of `SciChartGroup` still retains ~355 KB on rollup; the deep import (`scichart-react/SciChartGroup`) brings it back to the React floor on every bundler. Vite and esbuild improved sharply on alpha.162 (vite `groupOnly` fell from 273.1 to 44.6 KB) because scichart now ships an empty `sideEffects` array.


## What `measure` gates on

1. **Content assertions** ([scripts/assertBundles.ts](./scripts/assertBundles.ts)) — string-literal
   markers that survive minification:
   - the `configureDefaults` side effect (`"/scichart.wasm"`) must be present in every bundle that
     uses the chart components, and absent where tree-shaking should drop it;
   - the declarative marker must appear only in the config scenarios and the CJS control — proving
     the Builder API never leaks into `initChart`-only bundles;
   - a size delta backs up the markers: `declarative` ≫ `initChartOnly`, so the Builder rides only
     with the config path.
2. **Size regressions** ([scripts/compareBundleSizes.ts](./scripts/compareBundleSizes.ts)) — gzip
   growth beyond max(5 %, 5 KB) per scenario vs the committed [baseline/sizes.json](./baseline/sizes.json)
   fails the run. Intended growth: re-run with `npm run updateBaseline` and commit the diff.

## Load-bearing configuration notes

- **One compilation per scenario** (webpack multi-config, one `rollup()`/`build()` call each) —
  a shared compilation would let `fullImport` mark every export used and pollute the minimal scenarios.
- **Rollup**: `@rollup/plugin-node-resolve` must own resolution (it is what reads the packages'
  `sideEffects` arrays); `@rollup/plugin-commonjs` is scoped to genuinely-CJS modules
  (react/react-dom/scheduler, the wasm glue, the `cjs` builds); the TS transform is transform-only.
- **forceCjs** scenarios flip the bundler's export-condition order to `require`/`node` and
  `mainFields` to `["main"]` — nothing else changes, so the delta is purely the module format.
- Build target is es2020 (the wasm glue contains BigInt literals, which es2018 targets reject).
