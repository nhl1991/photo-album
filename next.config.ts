import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24, // 1일
  },

  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
