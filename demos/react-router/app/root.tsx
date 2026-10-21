import type { ReactElement, ReactNode } from "react";
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

/**
 * The document shell. It is rendered on the server for every request and must therefore stay
 * free of anything that touches `window`, `document` or WebGL — which is exactly why the chart
 * components live behind the client-only gates in the route modules rather than here.
 */
export function Layout({ children }: { children: ReactNode }): ReactElement {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                <nav>
                    <NavLink to="/">SciChartReact (initChart)</NavLink>
                    <NavLink to="/declarative">SciChartDeclarative (config)</NavLink>
                </nav>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App(): ReactElement {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactElement {
    let message = "Unexpected error";
    let details = "An unexpected error occurred.";

    if (isRouteErrorResponse(error)) {
        message = `${error.status}`;
        details = error.statusText || details;
    } else if (import.meta.env.DEV && error instanceof Error) {
        details = error.message;
    }

    return (
        <main>
            <h1>{message}</h1>
            <p>{details}</p>
        </main>
    );
}
