import { test, expect, type Page } from "@playwright/test";

/**
 * Mounts and unmounts a 2D and a 3D chart repeatedly in one page, and asserts that everything
 * SciChart created was both deleted and released.
 *
 * Two signals from SciChart's object registry, read after a forced garbage collection:
 * - `undeletedObjectsIds`: objects whose `delete()` was never called.
 * - `uncollectedObjectsIds`: objects that were deleted but are still held in memory by something.
 *
 * The demo must not pass chart objects to `console.log`: the browser console keeps every logged
 * object alive while DevTools or Playwright is attached, and they then count as uncollected.
 */

const CYCLES = 3;

/** Reads SciChart's object registry out of the page, via the debug wrapper's own button. */
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

    // the demo mounts the charts on load; every later cycle remounts them in the same page, so
    // anything left behind accumulates instead of being thrown away with the page
    await expect(toggle).toBeChecked();

    for (let cycle = 1; cycle <= CYCLES; cycle++) {
        if (!(await toggle.isChecked())) {
            await toggle.check();
        }

        // both engines are live before the unmount; the 3D module is fetched after the core
        await page.waitForFunction(() => document.querySelectorAll("canvas").length >= 2, undefined, {
            timeout: 60_000
        });
        await page.waitForTimeout(4000);

        await toggle.uncheck();
        await page.waitForTimeout(2000);

        // only meaningful after a real collection: without this the counts are dominated by
        // objects that simply have not been collected yet
        await client.send("HeapProfiler.collectGarbage");
        await page.waitForTimeout(500);

        readings.push({ cycle, ...(await readRegistry(page)) });
    }

    // eslint-disable-next-line no-console
    console.log("registry after each cycle:", JSON.stringify(readings));

    for (const reading of readings) {
        expect(reading.undeleted, `cycle ${reading.cycle}: ${reading.undeleted} object(s) were never deleted`).toBe(0);
        expect(
            reading.uncollected,
            `cycle ${reading.cycle}: ${reading.uncollected} deleted object(s) are still held in memory`
        ).toBe(0);
    }

    expect(pageErrors, "the page threw while mounting or unmounting").toEqual([]);
});
