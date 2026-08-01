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
            { from: "node_modules/scichart/_wasm/scichart.wasm", to: "" }
        ]
    })
];
