/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Performance optimizations
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://translate.google.com; frame-src 'self' *.famobi.com *.mathsisfun.com *.donothingfor2minutes.com *.xhalr.com *.quietkit.com *.colormandala.com *.colorzengame.com https://*;",
          },
          // Improved caching headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable, stale-while-revalidate=86400',
          },
          // Enable Brotli/Gzip
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
          // Preload critical assets
          // {
          //   key: 'Link',
          //   value: '</fonts/main.woff2>; rel=preload; as=font; crossorigin=anonymous',
          // },
        ],
      },
    ];
  },
  // Optimize chunk loading
  webpack: (config, { dev, isServer }) => {
    // Optimize chunks only in production and for client-side
    if (!dev && !isServer) {
      // Add terser plugin with better settings
      config.optimization.minimize = true;
      
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000,
        maxSize: 70000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        automaticNameDelimiter: '_',
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            chunks: 'all',
            enforce: true,
          },
          // Library chunk
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              if (!module.context) return 'lib.unknown';
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'unknown';
              return `lib.${packageName.replace('@', '')}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Vendor chunk optimized
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 20,
            enforce: true,
            reuseExistingChunk: true,
          },
          // Common chunk with more reuse
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Styles optimization
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
          },
        }
      };

      // Add module concatenation
      config.optimization.concatenateModules = true;
    }

      return config;
  },
  // Increase build output trace
  outputFileTracingRoot: process.cwd(),
  experimental: {
    scrollRestoration: true,
  },
  // Add retry script to document
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-retry-count',
            },
          ],
          destination: '/:path*',
        },
      ],
    };
  },
  // Improve performance for production builds
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig