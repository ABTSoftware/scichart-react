/**
 * Single source of truth for the bundle-check matrix, mirroring the structure of the core
 * library's BundleAnalysis harness (SciChart.JS.Dev/Web/src/SciChart/BundleAnalysis).
 *
 * Each scenario is one small entry module (`scenarios/<name>.tsx`) that imports a specific
 * slice of the `scichart-react` public API. Every bundler in {@link bundlerNames} builds every
 * applicable scenario, so identical input can be compared across bundlers and — via the
 * committed `baseline/sizes.json` — across builds of the package.
 *
 * Adding a new scenario is a one-file change: add an entry here plus `scenarios/<name>.tsx`
 * and `scenariosHtml/<name>.html` (the vite entry).
 */

/** The bundlers the harness drives. Vite (v5) uses Rollup internally for its production build. */
export const bundlerNames = ["webpack", "rollup", "esbuild", "vite"] as const;

/** Name of a supported bundler. */
export type TBundlerName = (typeof bundlerNames)[number];

/** Describes one tree-shaking measurement scenario. */
export interface IBundleScenario {
    /** Kebab/camel identifier; also the entry file stem and output folder name. */
    readonly name: string;
    /** What this scenario measures and why it matters. */
    readonly description: string;
    /** Restricts the scenario to a subset of bundlers. Omitted = built by all bundlers. */
    readonly bundlers?: readonly TBundlerName[];
    /**
     * When true, the bundler resolves packages through the CommonJS (`require`) export
     * condition instead of the ESM (`import`) condition. This reproduces what a
     * `"module": "commonjs"` consumer got before scichart-react 2.0, as a control
     * against the ESM builds.
     */
    readonly forceCjs?: boolean;
}

/**
 * The measurement matrix, ordered from smallest expected output (controls) to largest
 * (upper bound), with the CJS-resolution control last.
 */
export const bundleScenarios: readonly IBundleScenario[] = [
    {
        name: "typesOnly",
        description:
            "Type-only imports from 'scichart-react' and 'scichart'. Proves the harness floor: types are erased, so the bundle should be a few hundred bytes."
    },
    {
        name: "reactBaseline",
        description:
            "react-dom rendering a plain div, no scichart-react at all. The React floor — subtract it from any other scenario to see the scichart-react + scichart cost alone."
    },
    {
        name: "groupOnly",
        description:
            "Only SciChartGroup from the 'scichart-react' barrel. The barrel-skip probe: on webpack this should cost ~react only; rollup-family bundlers retain the barrel's reachable side-effect module (configureDefaults -> SciChartSurface graph)."
    },
    {
        name: "groupOnlyDeepImport",
        description:
            "SciChartGroup via the deep path 'scichart-react/SciChartGroup' (the './*' exports wildcard). Bypasses the barrel, so every bundler — not just webpack — should drop configureDefaults and the scichart graph."
    },
    {
        name: "initChartOnly",
        description:
            "SciChartReact with an initChart function building a minimal line chart from 'scichart' barrel imports. The headline number for code-first apps; must contain configureDefaults and must NOT contain the Builder path (SciChartDeclarative)."
    },
    {
        name: "nestedOverview",
        description:
            "The initChartOnly chart plus a SciChartNestedOverview child. Delta vs initChartOnly = the overview cost through the wrapper."
    },
    {
        name: "declarative",
        description:
            "SciChartDeclarative with a Builder API config. It calls registerAllTypes() so any definition works with no setup. Delta vs initChartOnly = the whole Builder API cost, paid only by apps using the config approach."
    },
    {
        name: "fullImport",
        description:
            "Namespace import of the entire 'scichart-react' barrel, kept alive. Upper bound: every component including the Builder path."
    },
    {
        name: "cjsRequireBaseline",
        description:
            "The initChartOnly code resolved through the 'require' export condition (lib/cjs of both scichart-react and scichart). Reproduces the pre-2.0 non-tree-shakable consumer as a control.",
        bundlers: ["webpack"],
        forceCjs: true
    }
];

/** Entry module path (harness-root-relative) for a scenario. */
export const scenarioEntryPath = (scenario: IBundleScenario): string => `scenarios/${scenario.name}.tsx`;

/** Vite HTML entry path (harness-root-relative) for a scenario. */
export const scenarioHtmlPath = (scenario: IBundleScenario): string => `scenariosHtml/${scenario.name}.html`;

/** Whether a scenario is built by the given bundler. */
export const includesBundler = (scenario: IBundleScenario, bundler: TBundlerName): boolean =>
    !scenario.bundlers || scenario.bundlers.includes(bundler);

/**
 * The memory64 wasm glue is lazily imported by scichart at runtime and is a runtime-only
 * artifact — kept out of the module graph so measurement is unaffected.
 *
 * Since v6 the glue lives in `_glue/` (`_wasm/` holds only servable binaries), and the memory64
 * variant is reached through a dynamic import from createMaster.
 */
export const runtimeOnlyWasmModulePattern = /_glue[/\\]scichart-64$/;
