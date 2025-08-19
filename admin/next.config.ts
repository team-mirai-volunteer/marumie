import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // srcディレクトリは自動的に認識されます
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
