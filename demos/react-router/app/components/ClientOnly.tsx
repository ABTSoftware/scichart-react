import { type ReactElement, type ReactNode, useSyncExternalStore } from "react";

/** A subscribe function that never notifies — the hydrated flag flips exactly once, at hydration. */
const subscribeToNothing = (): (() => void) => () => {};

const getHydratedSnapshot = (): boolean => true;

const getServerSnapshot = (): boolean => false;

/**
 * Returns `false` during the server render and the very first client render, then `true`.
 *
 * `useSyncExternalStore` is used rather than the older `useState(false)` + `useEffect`
 * combination because React reads `getServerSnapshot` for both the SSR pass and the
 * hydration pass. That guarantees the two agree and no hydration mismatch is reported,
 * without needing an extra render to settle.
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(subscribeToNothing, getHydratedSnapshot, getServerSnapshot);
}

/** Props for {@link ClientOnly}. */
export interface IClientOnlyProps {
    /**
     * Rendered only after hydration. Deliberately a function rather than a `ReactNode`: a
     * `ReactNode` child would already have been *evaluated* by the parent before `ClientOnly`
     * ever sees it, so any module-scope work in the child's file would still run on the server.
     */
    children: () => ReactNode;
    /** Rendered on the server and during the first client render. Keep the markup identical on both. */
    fallback?: ReactNode;
}

/**
 * Renders `children()` only in the browser, after React has hydrated.
 *
 * This is the wrapper used by the `/` route of this demo to keep `scichart-react` — which
 * creates a WebGL context and loads a WebAssembly module against `document` — out of the
 * server render. See README.md for how it compares to the `clientLoader` + `HydrateFallback`
 * approach used by the `/declarative` route.
 */
export function ClientOnly({ children, fallback = null }: IClientOnlyProps): ReactElement {
    const isHydrated = useHydrated();

    if (!isHydrated) {
        return <>{fallback}</>;
    }

    return <>{children()}</>;
}
