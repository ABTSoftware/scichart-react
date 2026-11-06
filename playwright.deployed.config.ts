import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

/**
 * Checks the published Storybook docs, by default the live GitHub Pages site. Runs after each deploy.
 * Starts no local server, unlike playwright.config.ts.
 */
const url = process.env.DEPLOYED_URL || "https://abtsoftware.github.io/scichart-react/";

// the site lives in a subfolder and the spec's paths are relative to it, so the URL must end with "/"
const DEPLOYED_URL = url.endsWith("/") ? url : `${url}/`;

export default defineConfig({
    ...config,
    projects: [{ name: "deployed", testMatch: /deployed\.spec\.ts/ }],
    webServer: undefined,
    use: { ...config.use, baseURL: DEPLOYED_URL }
});
