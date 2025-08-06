import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for Next.js 15
  experimental: {
    
  },
  
  // Turbopack configuration for Next.js 15
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Image configuration
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  },

  // Webpack configuration for handling assets
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|jpeg|gif|svg)$/i,
      type: 'asset/resource',
    });

    return config;
  },

  // Enable strict mode
  reactStrictMode: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
