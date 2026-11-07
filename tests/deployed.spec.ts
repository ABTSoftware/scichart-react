import { expect, test } from "@playwright/test";
import { defaultChartStateClassNames } from "../src/stateClassNames";

/** Each page downloads the engine over the network */
const TIMEOUT = 120_000;

type TStoryIndex = {
    entries: Record<string, { id: string; type: string }>;
};

test.beforeEach(async ({ page }) => {
    // SciChart reads this at module load, so it must be set before navigation
    await page.addInitScript(() => localStorage.setItem("IS_WEB_GPU", "0"));
});

test("every docs page loads its files and renders a chart", async ({ page, request }) => {
    // relative paths, so they resolve under the site's subfolder
    const index: TStoryIndex = await (await request.get("index.json")).json();
    const docsIds = Object.values(index.entries)
        .filter(entry => entry.type === "docs")
        .map(entry => entry.id);

    expect(docsIds.length, "no docs pages in the Storybook index").toBeGreaterThan(0);

    const failedRequests: string[] = [];
    page.on("response", response => {
        if (response.status() >= 400 && !response.url().endsWith("/favicon.ico")) {
            failedRequests.push(`${response.status()} ${response.url()}`);
        }
    });

    for (const id of docsIds) {
        await page.goto(`iframe.html?viewMode=docs&id=${id}`, { waitUntil: "domcontentloaded" });

        const rendered = page.locator(`.${defaultChartStateClassNames.rendered}`);

        // waits until a chart renders or a file fails to load, whichever comes first
        await expect
            .poll(async () => failedRequests.length > 0 || (await rendered.count()) > 0, {
                message: `${id} rendered no chart`,
                timeout: TIMEOUT
            })
            .toBe(true);

        expect(failedRequests, `${id} failed to load files`).toEqual([]);
    }
});
