import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/Aurae" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
