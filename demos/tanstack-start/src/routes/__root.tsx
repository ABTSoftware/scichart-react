import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

import appCss from "../styles.css?url";

/**
 * Root route rendering the full HTML document.
 *
 * `<HeadContent />` must live inside `<head>` and `<Scripts />` inside `<body>`, otherwise the
 * client bundle is never loaded and the app does not hydrate — which is exactly what the charts
 * on the index route wait for.
 */
export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "scichart-react with TanStack Start" }
        ],
        links: [{ rel: "stylesheet", href: appCss }]
    }),
    component: RootComponent
});

function RootComponent(): JSX.Element {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
    return (
        <html lang="en">
            <head>
                <HeadContent />
            </head>

            <body>
                {children}
                <Scripts />
            </body>
        </html>
    );
}
