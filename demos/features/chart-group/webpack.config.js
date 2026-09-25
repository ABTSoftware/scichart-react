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
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.json"
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        alias: {
            react: path.resolve("./node_modules/react")
            // scichart: path.resolve("./node_modules/scichart")
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
                { from: "../../../node_modules/scichart/_wasm/", to: "" }
            ]
        })
    ]
};
