import { expect, test, type Page } from "@playwright/test";

/**
 * How long a chart is given to load its wasm and paint. Generous because rendering is software
 * (SwiftShader) with WebGPU disabled, and a story can hold several charts.
 */
const CHART_READY_TIMEOUT = 120_000;

/** Extra frames to let 3D lighting settle before capturing. */
const SETTLE_FRAMES = 4;

type TStoryIndex = {
    entries: Record<string, { id: string; type: string }>;
};

const STORIES_THAT_ANIMATE = new Set([
    "example-scichartreact--primary-chart-example",
    "example-scichartreact--chart-with-init-callback",
    "example-scichartreact--chart-usage-with-typescript"
]);

/**
 * Stories whose settled state is their own loading overlay, not a chart, with the text that
 * overlay shows.
 *
 * Both are deliberate: ChartWithFallback never resolves its init function ("never resolve to
 * demonstrate the fallback"), and ChartGroupLoaderCustom throws to show the group's error path.
 * Waiting for them to finish loading would hang, so for these the overlay is the ready signal.
 */
const STORIES_THAT_STAY_LOADING = new Map([
    ["example-scichartreact--chart-with-fallback", "Loading..."],
    ["example-chartgrouploader--custom-chart-group-loader", "This is a custom Error Message"]
]);

/** The element SciChart's own loader draws; the wrapper's default fallback uses it. */
const DEFAULT_LOADER_SELECTOR = ".scichart_loader";

/**
 * Opens a story in isolation and waits until it has settled.
 *
 * While a surface is being created, the wrapper's default fallback shows SciChart's own loader and
 * removes it once the init function resolves, so the loader disappearing is the ready signal. A
 * canvas must exist too: without that check the wait passes on the frame before React has rendered
 * anything, and the capture is of an empty page.
 *
 * Stories with a custom fallback are recognised by the overlay's text instead. That keeps test
 * hooks out of both the published components and the story sources, which the docs display.
 */
async function openStory(page: Page, id: string): Promise<void> {
    await page.goto(`/iframe.html?viewMode=story&id=${id}`, { waitUntil: "domcontentloaded" });

    await page.waitForFunction(() => document.querySelector("canvas") !== null, undefined, {
        timeout: CHART_READY_TIMEOUT
    });

    const overlayText = STORIES_THAT_STAY_LOADING.get(id);

    if (overlayText) {
        await page.getByText(overlayText).waitFor({ timeout: CHART_READY_TIMEOUT });
    } else {
        await page
            .locator(DEFAULT_LOADER_SELECTOR)
            .first()
            .waitFor({ state: "detached", timeout: CHART_READY_TIMEOUT });
    }

    // The first painted frame is not necessarily the settled one - 3D lighting in particular keeps
    // refining for a few frames.
    await page.evaluate(async frames => {
        for (let i = 0; i < frames; i++) {
            await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
        }
    }, SETTLE_FRAMES);
}

test.beforeEach(async ({ page }) => {
    // SciChart reads this once at module load, so it has to be set before any navigation.
    await page.addInitScript(() => localStorage.setItem("IS_WEB_GPU", "0"));
});

test("every story matches its baseline", async ({ page, request }) => {
    const index: TStoryIndex = await (await request.get("/index.json")).json();
    const storyIds = Object.values(index.entries)
        .filter(entry => entry.type === "story")
        .map(entry => entry.id)
        .sort();

    expect(storyIds.length, "no stories found in the Storybook index").toBeGreaterThan(0);

    for (const id of storyIds) {
        await openStory(page, id);

        if (STORIES_THAT_ANIMATE.has(id)) {
            // These run a setInterval that keeps redrawing, so no two captures are alike and a
            // baseline is impossible. Assert they rendered at all; the story smoke tests cover
            // the rest.
            await expect.soft(page.locator("canvas").first(), `${id} rendered no canvas`).toBeVisible();
            continue;
        }

        // Soft so one changed story does not hide the rest.
        await expect.soft(page.locator("#storybook-root")).toHaveScreenshot(`${id}.png`);
    }
});

/**
 * Blank-output canary.
 *
 * If the environment renders nothing, every capture is identically blank and therefore matches an
 * equally blank baseline - the suite goes green while asserting nothing. Two visually different
 * charts must not produce the same image.
 */
test("different stories render different output", async ({ page }) => {
    await openStory(page, "example-scichartreact--chart-with-init-function");
    const lineChart = await page.locator("#storybook-root").screenshot();

    await openStory(page, "example-scichartreact--chart-with-pie-surface");
    const pieChart = await page.locator("#storybook-root").screenshot();

    expect(
        Buffer.compare(lineChart, pieChart),
        "a line chart and a pie chart captured identically - the charts are probably not rendering"
    ).not.toBe(0);
});
