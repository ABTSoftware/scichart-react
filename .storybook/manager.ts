import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";
import { Addon_Config } from "@storybook/types";
import { SciChartStorybookTheme } from "./SciChartStorybookTheme";

const config: Addon_Config = {
    theme: SciChartStorybookTheme
};

addons.setConfig(config);
