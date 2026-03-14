/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'swiper'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'triptune.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|ico|gif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/apis/:path*',
        destination: 'https://www.triptune.co.kr/api/:path*',
        // destination: 'http://13.209.177.247:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
