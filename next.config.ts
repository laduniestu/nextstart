import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typedRoutes: true,
  experimental: {
    browserDebugInfoInTerminal: true,
  },
};

export default nextConfig;
