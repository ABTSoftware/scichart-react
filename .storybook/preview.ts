import type { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },
        darkMode: {
            current: "dark",
            // Override the default dark theme
            dark: { ...themes.dark, appBg: "black" },
            // Override the default light theme
            light: { ...themes.normal, appBg: "red" }
        }
    }
};

export default preview;
