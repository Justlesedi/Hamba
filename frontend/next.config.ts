import path from "node:path";
import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "../backend/lib/security";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@hamba/backend"],
  outputFileTracingRoot: path.join(__dirname, ".."),
  outputFileTracingExcludes: {
    "*": ["../backend/data/**"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: Object.entries(SECURITY_HEADERS).map(([key, value]) => ({
          key,
          value,
        })),
      },
    ];
  },
};

export default nextConfig;
