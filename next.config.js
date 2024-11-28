/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'triptune.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.triptune.site/api/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/404',
        has: [
          {
            type: 'query',
            key: 'path',
            value: '^(?!.*\\/api\\/).*$',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
