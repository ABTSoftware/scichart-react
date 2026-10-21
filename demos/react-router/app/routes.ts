import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Two routes, each demonstrating a different way of keeping a client-only chart out of the
 * server render:
 * - `/` uses the reusable `<ClientOnly>` component.
 * - `/declarative` uses route-level `clientLoader` + `HydrateFallback`.
 */
export default [index("routes/home.tsx"), route("declarative", "routes/declarative.tsx")] satisfies RouteConfig;
