import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
const staticExport = process.env.FORMULAIC_STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const config = {
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // 关闭 source map
  cleanDistDir: true,
  staticPageGenerationTimeout: 180,
  ...(staticExport ? { outputFileTracingRoot: process.cwd() } : {}),
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
  experimental: {
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
    webpackMemoryOptimizations: true,
    webpackBuildWorker: true,
    serverSourceMaps: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    remotePatterns: [], // Prevent external image loading
    unoptimized: true, // Disable built-in image optimization
  },
  async rewrites() {
    if (staticExport) return [];
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
  async headers() {
    if (staticExport) return [];
    return [
      {
        source: "/giscus-:theme.css",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://giscus.app",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
        ],
      },
    ];
  },
};

if (staticExport) {
  delete config.rewrites;
  delete config.headers;
}

export default withMDX(config);
