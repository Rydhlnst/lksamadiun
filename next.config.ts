import type { NextConfig } from "next";

// When uploads live in Cloudflare R2, next/image must be allowed to load them.
const r2PublicUrl = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2PublicUrl
      ? [
          {
            protocol: r2PublicUrl.protocol.replace(":", "") as "http" | "https",
            hostname: r2PublicUrl.hostname,
          },
        ]
      : [],
  },
  experimental: {
    // Admin image uploads go through a Server Action (3 MB limit + overhead).
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
