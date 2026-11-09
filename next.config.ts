import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Use Next's type checker so build mode filters out .next/dev/types.
  // The default tsc CLI path checks both type directories and reports duplicate
  // identifiers for the generated route validators.
  experimental: { useTypeScriptCli: false },
};

export default nextConfig;
