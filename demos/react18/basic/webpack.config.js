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
            scichart: path.resolve("./node_modules/scichart")
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
                // Since v6 the engine is modular: a core plus side modules it loads at runtime
                // (scichart-data.wasm is fetched for every chart, scichart-charting3d.wasm for 3D).
                // Copy the whole directory so a new variant or module never breaks the build.
                {
                    from: "node_modules/scichart/_wasm/",
                    to: "",
                    globOptions: { ignore: ["**/SCRTTest*", "**/scichart2d*", "**/scichart3d*"] }
                }
            ]
        })
    ]
};
