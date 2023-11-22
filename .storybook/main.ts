import type { StorybookConfig } from "@storybook/react-webpack5";
const CopyPlugin = require("copy-webpack-plugin");

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-onboarding",
        "@storybook/addon-interactions",
        "storybook-dark-mode"
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {}
    },
    docs: {
        autodocs: "tag"
    },
    async webpackFinal(config, { configType }) {
        if (configType === "DEVELOPMENT") {
            // Modify config for development
        }
        if (configType === "PRODUCTION") {
            // Modify config for production
        }

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

        return config;
    }
};
export default config;
