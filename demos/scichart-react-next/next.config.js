const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    distDir: "build",
    output: "export",
    // Off until the core's revoked-proxy bug is fixed. SciChartMemoryDebugWrapper turns on the
    // object registry, which wraps engine objects in revocable proxies, and sets
    // autoDisposeWasmContext with a zero dispose timeout. Under StrictMode's double mount the
    // context is disposed and its proxy revoked between the two mounts, so the 3D module loader
    // reads a revoked proxy and throws. Removing any one of the three avoids it.
    reactStrictMode: false,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // prevents loading scichart package twice when referencing local scichart-react from parent folder.
        // The esm folder, not the package root: a folder alias bypasses the package's exports map, so
        // deep imports such as "scichart/Charting/..." only resolve against esm/
        Object.assign(config.resolve.alias, {
            scichart: path.resolve("./node_modules/scichart/esm")
        });

        return config;
    }
};

module.exports = nextConfig;
