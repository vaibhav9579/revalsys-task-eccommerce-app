import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Workaround for environments where Next's internal typecheck process cannot spawn.
    // Run `npm run typecheck` instead.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
