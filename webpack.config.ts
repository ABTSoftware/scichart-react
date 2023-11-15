import { Configuration } from "webpack";
const path = require("path");
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env: any, argv: any) => {
    const conf: Configuration = {

        // devServer: {
        //     static: path.join(__dirname, "build"),
        //     port: 8080,
        //     allowedHosts: "all",
        //     client: {
        //         overlay: {
        //             warnings: false,
        //             errors: true
        //         }
        //     }
        // },
        output: {
            path: path.join(__dirname, "dist"),
            // filename: argv.mode === "production" ? `[name].browser.js` : `[name].browser.dev.js`,
            library: "SciChart-React",
            libraryExport: "default",
            libraryTarget: "global",
            globalObject: "self"
        },
        // plugins: [
        //     new CopyPlugin({
        //         patterns: [
        //             { from: "../src/_wasm/scichart2d.wasm", to: "" },
        //             { from: "../src/_wasm/scichart2d.data", to: "" },
        //             { from: "../src/_wasm/scichart3d.wasm", to: "" },
        //             { from: "../src/_wasm/scichart3d.data", to: "" },
        //             { from: "client/index.html", to: "" },
        //             { from: "client/example.js", to: "" },
        //         ]
        //     })
        // ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        externals: {
            react: "react"
        }
    };

    if (argv.mode !== "production") {
        // @ts-ignore
        conf.devtool = "inline-source-map";
    }
    return conf;
};
