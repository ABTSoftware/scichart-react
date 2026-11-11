import { expect, test, type Page } from "@playwright/test";
import type { TLifecycleEntry } from "../.storybook/stories/LifecycleCallbacks.stories";

/** Software rendering and a wasm download per story make loading slow */
const TIMEOUT = 120_000;

/** The same chart mounted with each React root API */
const ROOTS = [
    { root: "createRoot", story: "basic" },
    { root: "ReactDOM.render", story: "legacy-root" }
];

const openStory = async (page: Page, name: string): Promise<void> => {
    await page.goto(`/iframe.html?viewMode=story&id=tests-lifecyclecallbacks--${name}`, {
        waitUntil: "domcontentloaded"
    });
};

/** Waits for a step to be logged and returns its entry */
const waitForStep = async (page: Page, step: string): Promise<TLifecycleEntry> => {
    const entry = await page.waitForFunction(s => window.lifecycleLog?.find(e => e.step === s), step, {
        timeout: TIMEOUT
    });

    return entry.jsonValue();
};

const getSteps = (page: Page): Promise<string[]> =>
    page.evaluate(() => (window.lifecycleLog ?? []).map(({ step }) => step));

/** Waits for the surface to be deleted and returns every logged step */
const waitForSurfaceDelete = async (page: Page): Promise<string[]> => {
    await waitForStep(page, "surface deleted");

    return getSteps(page);
};

const unmount = (page: Page): Promise<void> => page.getByRole("button", { name: "Unmount" }).click();

test.beforeEach(async ({ page }) => {
    // SciChart reads this at module load, so it must be set before navigation
    await page.addInitScript(() => localStorage.setItem("IS_WEB_GPU", "0"));
});

for (const { root, story } of ROOTS) {
    test.describe(root, () => {
        test("onInit runs before and onRendered after the fallback is removed", async ({ page }) => {
            await openStory(page, story);

            expect(await waitForStep(page, "onInit")).toMatchObject({ fallbackShown: true, childMounted: false });
            expect(await waitForStep(page, "onRendered")).toMatchObject({ fallbackShown: false, childMounted: true });
        });

        test("unmount runs every cleanup before deleting the surface", async ({ page }) => {
            await openStory(page, story);
            await waitForStep(page, "onRendered");
            await unmount(page);

            expect(await waitForSurfaceDelete(page)).toEqual([
                "initChart",
                "initChart resolved",
                "onInit",
                "onRendered",
                "onRendered cleanup",
                "onInit cleanup",
                "onDelete",
                "destructor",
                "surface deleted"
            ]);
        });
    });
}

test("unmount before init finishes runs only the destructor", async ({ page }) => {
    await openStory(page, "delayed-init");
    await waitForStep(page, "initChart");
    await unmount(page);
    await page.getByRole("button", { name: "Finish init" }).click();

    expect(await waitForSurfaceDelete(page)).toEqual([
        "initChart",
        "initChart resolved",
        "destructor",
        "surface deleted"
    ]);
});

test("unmount before the first render skips onRendered and its cleanup", async ({ page }) => {
    await openStory(page, "never-renders");
    await waitForStep(page, "onInit");
    await unmount(page);

    expect(await waitForSurfaceDelete(page)).toEqual([
        "initChart",
        "initChart resolved",
        "onInit",
        "onInit cleanup",
        "onDelete",
        "destructor",
        "surface deleted"
    ]);
});

test("unmount without a destructor deletes the surface", async ({ page }) => {
    await openStory(page, "no-destructor");
    await waitForStep(page, "onRendered");
    await unmount(page);

    expect(await waitForSurfaceDelete(page)).toEqual([
        "initChart",
        "initChart resolved",
        "onInit",
        "onRendered",
        "onRendered cleanup",
        "onInit cleanup",
        "onDelete",
        "surface deleted"
    ]);
});

/** Lets a pending unhandled rejection reach the test as a page error */
const settle = (page: Page): Promise<void> => page.evaluate(() => new Promise<void>(r => setTimeout(r, 200)));

/** Init failures, with the steps logged before and while handling them */
const INIT_ERRORS = [
    { name: "initChart", story: "init-chart-throws", message: "initChart failed", steps: ["initChart"] },
    {
        name: "onInit",
        story: "on-init-throws",
        message: "onInit failed",
        steps: ["initChart", "initChart resolved", "onInit", "destructor", "surface deleted"]
    }
];

for (const { name, story, message, steps } of INIT_ERRORS) {
    test.describe(`${name} throwing`, () => {
        test("deletes what init created and reports the error only to onInitError", async ({ page }) => {
            const pageErrors: string[] = [];
            page.on("pageerror", error => pageErrors.push(error.message));

            await openStory(page, story);
            await waitForStep(page, "onInitError");
            await expect(page.getByTestId("fallback")).toBeVisible();
            await unmount(page);
            await settle(page);

            expect(await getSteps(page)).toEqual([...steps, "onInitError"]);
            expect(pageErrors).toEqual([]);
        });

        test("without onInitError, deletes what init created and reports one unhandled error", async ({ page }) => {
            const pageErrors: string[] = [];
            page.on("pageerror", error => pageErrors.push(error.message));

            await openStory(page, `${story}-unhandled`);
            await expect.poll(() => pageErrors, { timeout: TIMEOUT }).toEqual([message]);
            await unmount(page);
            await settle(page);

            expect(await getSteps(page)).toEqual(steps);
            expect(pageErrors).toEqual([message]);
        });

        test("without onInitError in StrictMode, reports one unhandled error", async ({ page }) => {
            const pageErrors: string[] = [];
            page.on("pageerror", error => pageErrors.push(error.message));

            await openStory(page, `${story}-unhandled-strict`);
            await expect.poll(() => pageErrors, { timeout: TIMEOUT }).toEqual([message]);
            await unmount(page);
            await settle(page);

            expect(await getSteps(page)).toEqual(steps);
            expect(pageErrors).toEqual([message]);
        });
    });
}

test("ChartGroupLoader calls onInit before and onRendered after removing its fallback", async ({ page }) => {
    await openStory(page, "group");

    expect(await waitForStep(page, "group onInit")).toMatchObject({ fallbackShown: true });
    expect(await waitForStep(page, "group onRendered")).toMatchObject({ fallbackShown: false, childMounted: true });
});

test("a chart's onInit throwing in ChartGroupLoader deletes the chart and reports to the group", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", error => pageErrors.push(error.message));

    await openStory(page, "group-on-init-throws");
    await waitForStep(page, "group onInitError");
    await settle(page);

    expect(await getSteps(page)).toEqual(["onInit", "destructor", "surface deleted", "group onInitError"]);
    await expect(page.getByTestId("fallback")).toBeVisible();
    expect(pageErrors).toEqual([]);
});
