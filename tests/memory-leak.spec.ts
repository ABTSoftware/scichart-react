import { test, expect, type Page } from "@playwright/test";

/**
 * Mounts and unmounts a 2D and a 3D chart repeatedly and asserts the wrapper deleted everything
 * it created.
 *
 * The signal is `undeletedObjectsIds` — objects SciChart registered whose `delete()` was never
 * called. That is what this wrapper is responsible for, and it is empty today, so the test is
 * meaningful from the start and fails if a `delete()` goes missing.
 *
 * It is deliberately NOT `uncollectedObjectsIds`, which counts objects not yet garbage collected.
 * That grows by 8 per cycle because the core retains surfaces, axes and data series after they are
 * deleted — reproduced identically on scichart-react 1.0.0 with scichart 5.2.69, so it is not this
 * package's doing. Gating on it would fail forever through no fault of this repo.
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

test("charts are fully deleted after mount and unmount", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", error => pageErrors.push(String(error)));

    const readings: Array<{ cycle: number; undeleted: number; uncollected: number }> = [];

    for (let cycle = 1; cycle <= CYCLES; cycle++) {
        // A fresh page per cycle, rather than toggling the charts back on. Remounting a 3D chart
        // under the debug wrapper currently throws in the core - the wrapper enables revocable
        // proxies and a zero-delay wasm dispose, so the context is disposed and its proxy revoked
        // between unmount and the next mount, and the 3D module loader then reads it. Reloading
        // sidesteps that without having to ignore the error, which would also hide real ones.
        await page.goto("/");

        const toggle = page.locator('input[type="checkbox"]');
        await expect(toggle).toBeChecked();
        // both engines are live before the unmount; the 3D module is fetched after the core
        await page.waitForFunction(() => document.querySelectorAll("canvas").length >= 2, undefined, {
            timeout: 60_000
        });
        await page.waitForTimeout(4000);

        const client = await page.context().newCDPSession(page);
        await client.send("HeapProfiler.enable");

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
        expect(
            reading.undeleted,
            `cycle ${reading.cycle}: ${reading.undeleted} object(s) were never deleted`
        ).toBe(0);
    }

    expect(pageErrors, "the page threw while mounting or unmounting").toEqual([]);
});
