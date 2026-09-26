import { addons } from "storybook/manager-api";
import { Addon_Config } from "storybook/internal/types";
import { SciChartStorybookTheme } from "./SciChartStorybookTheme";

const config: Addon_Config = {
    theme: SciChartStorybookTheme
};

addons.setConfig(config);
