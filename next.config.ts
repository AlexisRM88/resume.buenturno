import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    // Convex backend files are type-checked separately by `npx convex deploy`
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
