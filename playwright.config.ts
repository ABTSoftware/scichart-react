import { defineConfig } from "@playwright/test";

// Deliberately not 6006: a Storybook dev server on the default port would be reused by
// `reuseExistingServer` and the suite would silently test whatever project owns it.
const STORYBOOK_PORT = 6106;
const APP_PORT = 3100;

/**
 * Two suites with different needs.
 *
 * `stories` renders every Storybook story against a committed baseline. Rendering is deliberately
 * left on Playwright's default headless renderer, which is SwiftShader (software) even on a machine
 * with a GPU; hardware output depends on the GPU and its driver. No --use-gl / --use-angle flags:
 * they force software on some platforms anyway and are a known cause of WebGL context loss in
 * headless Windows.
 *
 * Software output still differs slightly between machines, so the only committed baselines are the
 * Linux ones, recorded and judged by CI's browser-tests job inside the pinned Playwright image (see
 * .github/workflows/ci.yaml). Runs anywhere else write their own platform's folder, which git
 * ignores; `npm run test:docker` runs the suite in the CI image for a local check.
 *
 * `app` drives demos/features/chart-group for the memory-leak test: a ChartGroupLoader holding two 2D
 * charts and a 3D chart, behind SciChartMemoryDebugWrapper. The demo compiles the library from
 * src/, so the test needs no library build. It runs the webpack dev server rather than a production
 * build because SciChart compiles its memory-debug registry out of production builds -
 * MemoryUsageHelper only creates objectRegistry when NODE_ENV is not "production" - so the leak test
 * would have nothing to read.
 */
export default defineConfig({
    testDir: "./tests",
    fullyParallel: false,
    // the engine is a single shared wasm context; parallel workers fight over it
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: 0,
    // the engine downloads and compiles wasm on each mount, well past the default 30s
    timeout: 240_000,
    reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],

    use: {
        // Pinned so layout - and therefore the baselines - cannot shift with the window.
        viewport: { width: 800, height: 600 },
        deviceScaleFactor: 1,
        launchOptions: {
            args: [
                // SciChart v6 picks WebGPU when it is available. Force the WebGL path.
                "--disable-features=WebGPU",
                // Chromium evicts the least-recently-used WebGL context past a cap of 16 per
                // renderer, which surfaces as context-loss flakes once several charts exist.
                "--max-active-webgl-contexts=64"
            ]
        }
    },

    projects: [
        {
            name: "stories",
            testMatch: /visual\.spec\.ts/,
            use: { baseURL: `http://127.0.0.1:${STORYBOOK_PORT}` }
        },
        {
            name: "app",
            testMatch: /memory-leak\.spec\.ts/,
            // tall enough for all three charts of the group to be on screen
            use: { baseURL: `http://127.0.0.1:${APP_PORT}`, viewport: { width: 800, height: 1200 } }
        }
    ],

    webServer: [
        {
            command: `npm run build-storybook -- --quiet && npx http-server storybook-static -a 127.0.0.1 --port ${STORYBOOK_PORT} --silent`,
            url: `http://127.0.0.1:${STORYBOOK_PORT}`,
            reuseExistingServer: !process.env.CI,
            timeout: 600_000
        },
        {
            command: `npm --prefix demos/features/chart-group run dev -- --port ${APP_PORT} --host 127.0.0.1`,
            url: `http://127.0.0.1:${APP_PORT}`,
            reuseExistingServer: !process.env.CI,
            timeout: 300_000
        }
    ],

    expect: {
        toHaveScreenshot: {
            // Tolerant enough to absorb antialiasing noise, tight enough to catch a real change.
            maxDiffPixelRatio: 0.002,
            threshold: 0.2,
            animations: "disabled",
            scale: "css"
        }
    },

    // Per platform, so a run on macOS or Windows never compares against or overwrites the committed
    // Linux set: fonts and the GL stack differ between them.
    snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}"
});
