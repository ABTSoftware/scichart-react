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
                { from: "../../../node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "../../../node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "../../../node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "../../../node_modules/scichart/_wasm/scichart3d.wasm", to: "" }
            ]
        })
    ]
};
