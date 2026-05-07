import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import path from "node:path";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Закрепляем корень проекта, чтобы Next не путался с lockfile из home.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default withSerwist(nextConfig);
