import { test, expect, type Page } from "@playwright/test";
import { defaultGroupStateClassNames } from "../src/stateClassNames";

/**
 * Mounts and unmounts the chart-group demo (two 2D charts and a 3D chart) several times in one page,
 * then checks SciChart's object registry: nothing left undeleted, nothing deleted but still in memory.
 *
 * The demo must not log chart objects: the console keeps them alive while Playwright is attached.
 */

const CYCLES = 3;

/** Reads SciChart's object registry through the debug wrapper's button, which logs it */
async function readRegistry(page: Page): Promise<{ undeleted: number; uncollected: number }> {
    return page.evaluate(() => {
        let state: any = null;
        const original = console.log;

        console.log = (...args: any[]) => {
            if (args[0] === "state") {
                state = args[1];
            }
        };
        document.querySelector<HTMLInputElement>('input[type="button"]')!.click();
        console.log = original;

        return {
            undeleted: state?.undeletedObjectsIds?.length ?? 0,
            uncollected: state?.uncollectedObjectsIds?.length ?? 0
        };
    });
}

test("charts are fully deleted and released after mount and unmount", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", error => pageErrors.push(String(error)));

    const readings: Array<{ cycle: number; undeleted: number; uncollected: number }> = [];

    await page.goto("/");

    const toggle = page.locator('input[type="checkbox"]');
    const client = await page.context().newCDPSession(page);
    await client.send("HeapProfiler.enable");

    for (let cycle = 1; cycle <= CYCLES; cycle++) {
        await toggle.check();
        await page.locator(`.${defaultGroupStateClassNames.rendered}`).waitFor({ timeout: 60_000 });
        await page.waitForTimeout(2000);

        await toggle.uncheck();
        await page.waitForTimeout(2000);

        // the counts mean nothing until a real collection has run
        await client.send("HeapProfiler.collectGarbage");
        await page.waitForTimeout(500);

        readings.push({ cycle, ...(await readRegistry(page)) });
    }

    // eslint-disable-next-line no-console
    console.log("registry after each cycle:", JSON.stringify(readings));

    for (const { cycle, undeleted, uncollected } of readings) {
        expect(undeleted, `cycle ${cycle}: ${undeleted} object(s) never deleted`).toBe(0);
        expect(uncollected, `cycle ${cycle}: ${uncollected} deleted object(s) still in memory`).toBe(0);
    }

    expect(pageErrors, "the page threw while mounting or unmounting").toEqual([]);
});
