const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

// `--env fixed` builds the variant with the eager `import "scichart-react/configureDefaults"`.
module.exports = env => ({
    entry: env.fixed ? "./src/index.fixed.tsx" : "./src/index.tsx",
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{ loader: "ts-loader" }]
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },
    // Everything lives under /demo/, like the Examples site in production. The wrapper's
    // default "/scichart.wasm" therefore points at a file that does not exist.
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build/demo"),
        publicPath: "/demo/",
        clean: true
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "" },
                { from: "node_modules/scichart/_wasm/", to: "" }
            ]
        })
    ]
});
