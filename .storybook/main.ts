// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { createRequire } from "node:module";
import type { StorybookConfig } from "@storybook/react-webpack5";
import { merge } from "webpack-merge";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const path = require("path");

const config: StorybookConfig = {
    stories: [
        "./stories/SciChartReact.stories.tsx",
        "./stories/**/*.mdx",
        "./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],

    addons: [
        "@storybook/addon-links",
        "@storybook/addon-docs",
        // since v8 the webpack5 builder ships no compiler; this one reuses .babelrc.json
        "@storybook/addon-webpack5-compiler-babel"
    ],

    // the whole _wasm directory, not a single file: the core picks a variant per browser and
    // fetches side modules (charting3d) relative to it, matching what the README tells consumers
    staticDirs: ["./public", { from: "../node_modules/scichart/_wasm", to: "/" }],

    framework: {
        name: "@storybook/react-webpack5",
        options: {}
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

        return customizedWebpackConfig;
    }
};
export default config;
