import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["framer-motion"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
