import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  logging: {
    fetches: {
      fullUrl: false,
    },
    incomingRequests: false,
  },
  experimental: {
    prefetchInlining: true,
    cachedNavigations: true,
    appNewScrollHandler: true,
    inlineCss: true,
  },
  turbopack: {
    resolveAlias: {
      "zod/v4": "zod",
    },
  },
};

export default nextConfig;
