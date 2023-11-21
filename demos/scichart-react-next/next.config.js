const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "",
    distDir: "build",
    output: "export",
    reactStrictMode: true, // default - true
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // prevents loading scichart package twice when referencing local scichart-react from parent folder
        Object.assign(config.resolve.alias, {
            scichart: path.resolve("./node_modules/scichart")
        });

        return config;
    }
};

module.exports = nextConfig;
