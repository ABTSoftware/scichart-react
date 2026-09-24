import type IForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
const CopyPlugin = require("copy-webpack-plugin");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

export const plugins = [
    new ForkTsCheckerWebpackPlugin({
        logger: "webpack-infrastructure"
    }),
    new CopyPlugin({
        patterns: [
            { from: "src/index.html", to: "" },
            // the whole _wasm directory: the core picks a variant per browser and fetches
            // side modules (charting3d) relative to it, so a single file is not enough
            { from: "node_modules/scichart/_wasm/", to: "" }
        ]
    })
];
