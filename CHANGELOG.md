# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file is not shipped in the npm package — the tarball root is `lib/`, which carries
`README_NPM.md` as its readme.

## [2.0.0]

The 2.0 line targets SciChart.js v6 and is built and verified against `scichart` 6.0.1.

### Breaking

-   **`scichart` peer dependency is now v6+.** The engine ships one union `scichart.wasm` instead of
    the `scichart2d.wasm` / `scichart3d.wasm` pair, and there are no more `.data` files. The WASM
    payload to deploy is the whole `_wasm` **directory**, not a single file. Apps staying on
    scichart 3.x–5.x should stay on scichart-react 1.x. When upgrading the core library, the
    `scichart-migrate` codemod automates the renames.
-   **The `config` prop moved to the new `SciChartDeclarative` component.** Replace
    `<SciChartReact config={...} />` with `<SciChartDeclarative config={...} />` — one JSX rename,
    all other props identical. `SciChartReact` now requires `initChart` and throws a pointer error
    if it receives `config`.
-   **`SciChartOverview` no longer mirrors** palette providers, animations or data labels onto the
    overview's mini series. Set them on the overview series explicitly if you relied on that.
-   **The Builder API registers nothing on import.** Since SciChart v6, types used by a JSON config
    must be registered explicitly (`registerNumericAxis`, `registerXyDataSeries`, …), or via the
    `registerAllTypes()` escape hatch. `SciChartDeclarative` calls `registerAllTypes()` internally,
    so declarative users are unaffected.

### Added

-   `SciChartDeclarative` — the JSON-config component split out of `SciChartReact`.
-   `configureSciChartDefaults` — the import-time global defaults, now also callable directly and
    importable as `scichart-react/configureDefaults`.
-   Exported types `IChartComponentPropsCore`, `TChartComponentPropsWithInit` and
    `TChartComponentPropsWithConfig`.
-   `SciChartMemoryDebugWrapper` gained a `defaultRenderChildren` prop, so the children can be
    rendered on the first render instead of waiting for the checkbox. Its props are now typed
    rather than `any`.

### Changed

-   **Dual ESM/CJS output** with an `exports` map, a `module` entry and subpath deep imports
    (`scichart-react/SciChartGroup`), replacing the single flat CommonJS build.
-   **`sideEffects` narrowed** to `configureDefaults.js` only, so bundlers can drop everything a
    consumer does not import. An `initChart`-only bundle no longer drags in the Builder.
-   `"use client"` directives added, so the components work in React Server Component setups.
-   `react` peer dependency raised to `>=16.14.0`.
-   Each surface returned from `initChart` is marked as externally lifecycle-managed, which
    suppresses the core's "root detached before delete" and "surface already deleted"
    memory-debug warnings. Both are expected here: the component removes the chart root before
    the asynchronous delete, and a surface can be deleted twice (the nested overview). The flag
    is only set when the core exposes it, so this is inert against scichart 6.0.1 and takes
    effect with the core release that adds it.

### Deprecated

-   `TChartComponentProps` — use `TChartComponentPropsWithInit` or `TChartComponentPropsWithConfig`.

## [1.0.0]

First stable release of the 1.x line, targeting SciChart.js 3.x–5.x.

[2.0.0]: https://github.com/ABTSoftware/scichart-react/releases/tag/v2.0.0
[1.0.0]: https://github.com/ABTSoftware/scichart-react/releases/tag/v1.0.0
