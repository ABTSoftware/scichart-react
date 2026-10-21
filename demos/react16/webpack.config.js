const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        alias: {
            react: path.resolve("./node_modules/react"),
            // the esm folder, not the package root: a folder alias bypasses the package's exports
            // map, so deep imports such as "scichart/Charting/..." only resolve against esm/
            scichart: path.resolve("../../node_modules/scichart/esm")
        }
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "" },
                // the whole _wasm directory: the core picks a variant per browser and fetches
                // side modules (charting3d) relative to it, so a single file is not enough
                { from: "../../node_modules/scichart/_wasm/", to: "" }
            ]
        })
    ]
};
