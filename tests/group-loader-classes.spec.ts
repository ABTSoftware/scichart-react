import { expect, test, type Page } from "@playwright/test";
import { defaultChartStateClassNames as chart, defaultGroupStateClassNames as group } from "../src/stateClassNames";

const TIMEOUT = 120_000;

const openStory = (page: Page, id: string) =>
    page.goto(`/iframe.html?viewMode=story&id=${id}`, { waitUntil: "domcontentloaded" });

test.beforeEach(async ({ page }) => {
    // SciChart reads this at module load, so it must be set before navigation
    await page.addInitScript(() => localStorage.setItem("IS_WEB_GPU", "0"));
});

test("SciChartReact adds the initialized and rendered classes", async ({ page }) => {
    await openStory(page, "example-scichartreact--chart-with-init-function");

    await expect(page.locator(`.${chart.rendered}`)).toContainClass(chart.initialized, { timeout: TIMEOUT });
});

test("ChartGroupLoader adds the initialized and rendered classes", async ({ page }) => {
    await openStory(page, "example-chartgrouploader--basic-chart-group-loader");

    await expect(page.locator(`.${group.rendered}`)).toContainClass(group.initialized, {
        timeout: TIMEOUT
    });
});

test("ChartGroupLoader adds no class when an init function throws", async ({ page }) => {
    await openStory(page, "example-chartgrouploader--custom-chart-group-loader");

    await page.getByText("This is a custom Error Message").waitFor({ timeout: TIMEOUT });

    await expect(page.locator(`.${group.initialized}, .${group.rendered}`)).toHaveCount(0);
});
