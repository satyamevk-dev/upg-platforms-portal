import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  output: "standalone",
  images: {
    qualities: [75, 88],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
