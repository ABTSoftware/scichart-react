import type { StorybookConfig } from "@storybook/react-webpack5";
import merge from "webpack-merge";
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const config: StorybookConfig = {
    stories: ["./stories/SciChartReact.stories.tsx", "./stories/**/*.mdx", "./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
    staticDirs: ["./public"],
    framework: {
        name: "@storybook/react-webpack5",
        options: {}
    },
    docs: {
        autodocs: "tag"
    },
    async webpackFinal(webpackConfig, { configType }) {
        if (configType === "DEVELOPMENT") {
            // Modify config for development
        }
        if (configType === "PRODUCTION") {
            // Modify config for production
        }
        const customizedWebpackConfig = merge(
            {
                resolve: {
                    alias: {
                        "scichart-react": path.resolve(__dirname, "../src/")
                    }
                }
            },
            webpackConfig
        );

        // config.plugins?.push(
        //     new CopyPlugin({
        //         patterns: [
        //             { from: "src/index.html", to: "" },
        //             { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
        //             { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
        //             { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
        //             { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" }
        //         ]
        //     })
        // );

        return customizedWebpackConfig;
    }
};
export default config;
