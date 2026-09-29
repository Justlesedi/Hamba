import path from "node:path";
import type { NextConfig } from "next";
import { SECURITY_HEADERS } from "../backend/lib/security";

const nextConfig: NextConfig = {
  transpilePackages: ["@hamba/backend"],
  outputFileTracingRoot: path.join(__dirname, ".."),
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
