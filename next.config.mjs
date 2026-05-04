import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // 关闭 source map
  cleanDistDir: true,
  typescript: {
    ignoreBuildErrors: true, // 不做全量类型检查
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
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
  async headers() {
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

export default withMDX(config);
