import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CORE_API_URL: process.env.NEXT_PUBLIC_CORE_API_URL || process.env.CORE_API_URL || "https://api.testnet.hiro.so",
  },
  async rewrites() {
    const core = process.env.NEXT_PUBLIC_CORE_PROXY || process.env.CORE_API_URL;
    // If you set NEXT_PUBLIC_CORE_PROXY, UI can call /core/* without CORS issues
    if (core) {
      return [
        {
          source: "/core/:path*",
          destination: `${core.replace(/\/$/, "")}/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
