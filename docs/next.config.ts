import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/Aurae",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
