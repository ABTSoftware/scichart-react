import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

/**
 * Router factory picked up by the TanStack Start Vite plugin for both the server and the browser.
 * The route tree is generated from `src/routes` into `src/routeTree.gen.ts` on `dev` and `build`.
 *
 * The return type is deliberately left to inference — TanStack Router derives the fully typed
 * router from the generated route tree, and annotating it would erase that inference.
 */
export function getRouter() {
    return createRouter({
        routeTree,
        scrollRestoration: true
    });
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }
}
