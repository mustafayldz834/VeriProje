const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
      webpack: (config, { dev, isServer }) => {
        // Optimize cache configuration to prevent serialization warnings
        if (dev) {
          config.cache = {
            type: 'filesystem',
            compression: 'gzip',
            maxMemoryGenerations: 1,
            cacheDirectory: path.resolve(__dirname, '.next/cache'),
            buildDependencies: {
              config: [__filename],
            },
            // Optimize serialization
            store: 'pack',
            version: '1.0.0',
            // Reduce memory usage
            maxAge: 1000 * 60 * 60 * 24, // 1 day
          }
        }

        // Optimize bundle size
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
              mantine: {
                test: /[\\/]node_modules[\\/]@mantine[\\/]/,
                name: 'mantine',
                chunks: 'all',
              },
            },
          },
          // Remove conflicting optimizations
          concatenateModules: false,
          sideEffects: false,
        }

        return config
      },
  // Reduce bundle size warnings
  experimental: {
    optimizeCss: true,
  },
  // Compress static files
  compress: true,
}

module.exports = nextConfig
