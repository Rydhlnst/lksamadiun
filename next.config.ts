import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Admin image uploads go through a Server Action (3 MB limit + overhead).
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
