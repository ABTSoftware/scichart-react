import { expect, test, type Page } from "@playwright/test";
import { defaultChartStateClassNames } from "../src/stateClassNames";

/** Software rendering and a wasm download per story make loading slow */
const TIMEOUT = 120_000;

/** 3D lighting keeps refining for a few frames after the first one */
const SETTLE_FRAMES = 4;

type TStoryIndex = {
    entries: Record<string, { id: string; type: string; tags: string[] }>;
};

/** Tags stories that exist only for other specs */
const TEST_ONLY_TAG = "test-only";

/** Redraw on a timer, so no two captures match */
const STORIES_THAT_ANIMATE = new Set([
    "example-scichartreact--primary-chart-example",
    "example-scichartreact--chart-with-init-callback",
    "example-scichartreact--chart-usage-with-typescript"
]);

/** Never finish loading on purpose; settled once their overlay shows this text */
const STORIES_THAT_STAY_LOADING = new Map([
    ["example-scichartreact--chart-with-fallback", "Loading..."],
    ["example-chartgrouploader--custom-chart-group-loader", "This is a custom Error Message"]
]);

/** Opens a story in isolation and waits until every chart in it has rendered */
async function openStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?viewMode=story&id=${id}`, { waitUntil: "domcontentloaded" });

    await page.locator("canvas").first().waitFor({ state: "attached", timeout: TIMEOUT });

    const overlayText = STORIES_THAT_STAY_LOADING.get(id);

    if (overlayText) {
        await page.getByText(overlayText).waitFor({ timeout: TIMEOUT });
    } else {
        // the loaders go once every chart is initialized; each chart then gets its rendered class
        await page.locator(".scichart_loader").first().waitFor({ state: "detached", timeout: TIMEOUT });
        await page.waitForFunction(
            ({ initialized, rendered }) =>
                document.querySelector(`.${rendered}`) !== null &&
                document.querySelector(`.${initialized}:not(.${rendered})`) === null,
            { ...defaultChartStateClassNames },
            { timeout: TIMEOUT }
        );
    }

    await page.evaluate(async frames => {
        for (let i = 0; i < frames; i++) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }, SETTLE_FRAMES);
}

test.beforeEach(async ({ page }) => {
    // SciChart reads this at module load, so it must be set before navigation
    await page.addInitScript(() => localStorage.setItem("IS_WEB_GPU", "0"));
});

test("every story matches its baseline", async ({ page, request }) => {
    const index: TStoryIndex = await (await request.get("/index.json")).json();
    const storyIds = Object.values(index.entries)
        .filter(entry => entry.type === "story" && !entry.tags.includes(TEST_ONLY_TAG))
        .map(entry => entry.id)
        .sort();

    expect(storyIds.length, "no stories in the Storybook index").toBeGreaterThan(0);

    for (const id of storyIds) {
        await openStory(page, id);

        if (STORIES_THAT_ANIMATE.has(id)) {
            await expect.soft(page.locator("canvas").first(), `${id} rendered no canvas`).toBeVisible();
            continue;
        }

        await expect.soft(page.locator("#storybook-root")).toHaveScreenshot(`${id}.png`);
    }
});

// Catches an environment that renders nothing, where blank captures would match blank baselines
test("different stories render different output", async ({ page }) => {
    await openStory(page, "example-scichartreact--chart-with-init-function");
    const lineChart = await page.locator("#storybook-root").screenshot();

    await openStory(page, "example-scichartreact--chart-with-pie-surface");
    const pieChart = await page.locator("#storybook-root").screenshot();

    expect(Buffer.compare(lineChart, pieChart), "a line and a pie chart captured identically").not.toBe(0);
});
