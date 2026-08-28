import * as path from "path";
import webpack, { type Configuration } from "webpack";
import { bundleScenarios, includesBundler, runtimeOnlyWasmModulePattern, scenarioEntryPath, type IBundleScenario } from "./scenarios";

/**
 * One webpack compilation PER scenario (an array of Configuration objects), NOT one config
 * with many entries. This is load-bearing: webpack computes `usedExports` across the whole
 * module graph of a single compilation, so a shared compilation would let the fullImport
 * entry mark every export as used and pollute the minimal scenarios' dead-code elimination.
 *
 * The `scichart-react` dependency is a symlink to ../lib; `resolve.symlinks: false` keeps
 * modules attributed to node_modules/scichart-react.
 */

const rootDir = __dirname;

const importConditions = ["import", "browser", "module", "default"];
const requireConditions = ["require", "node", "default"];

const makeConfig = (scenario: IBundleScenario): Configuration => ({
    name: scenario.name,
    mode: "production",
    target: "web",
    entry: path.resolve(rootDir, scenarioEntryPath(scenario)),
    output: {
        path: path.resolve(rootDir, "dist", "webpack", scenario.name),
        filename: "bundle.js",
        clean: true
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        symlinks: false,
        conditionNames: scenario.forceCjs ? requireConditions : importConditions,
        mainFields: scenario.forceCjs ? ["main"] : ["module", "main"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                    onlyCompileBundledFiles: true,
                    compilerOptions: { module: "esnext", jsx: "react-jsx", noEmit: false }
                }
            }
        ]
    },
    optimization: {
        usedExports: true,
        sideEffects: true,
        minimize: true,
        concatenateModules: true
    },
    performance: { hints: false },
    devtool: false,
    stats: "errors-warnings",
    plugins: [
        // The memory64 glue is lazily imported and is a runtime-only artifact — keep it out
        // of the graph so measurement is unaffected.
        new webpack.IgnorePlugin({ resourceRegExp: runtimeOnlyWasmModulePattern })
    ]
});

const configs: Configuration[] = bundleScenarios
    .filter(scenario => includesBundler(scenario, "webpack"))
    .map(makeConfig);

export default configs;
