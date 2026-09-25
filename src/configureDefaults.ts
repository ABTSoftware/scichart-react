import { SciChartDefaults, SciChartSurface } from "scichart";

/**
 * Applies scichart-react's default global SciChart configuration.
 *
 * This module executes at import time and is the ONLY module in this package listed in
 * the "sideEffects" arrays (lib/cjs/package.json and lib/esm/package.json), so bundlers
 * preserve it while tree-shaking everything else. Every other module in this package must
 * stay side-effect-free at import time.
 *
 * Consumers can override any of these defaults after importing scichart-react — user code
 * always runs after this import-time configuration:
 * ```ts
 * SciChartSurface.configure({ wasmUrl: "https://cdn.example.com/scichart.wasm" });
 * ```
 *
 * To re-apply the defaults, call this function. To force-keep this configuration under an
 * exotic bundler setup, import the module directly:
 * ```ts
 * import "scichart-react/configureDefaults";
 * ```
 */
export function configureSciChartDefaults(): void {
    // Resolve the WASM core against the app base URL. Side modules (charting3d) are fetched
    // on demand relative to this URL's directory, so pointing at the core configures them too.
    SciChartSurface.configure({
        wasmUrl: "/scichart.wasm"
    });

    // The wrapper renders its own React fallback; disable the core DOM loader.
    SciChartDefaults.defaultLoader = false;
    SciChartDefaults.disableAspect = true;
}

configureSciChartDefaults();
