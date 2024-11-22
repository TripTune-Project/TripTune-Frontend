/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
    }
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
        destination: 'http://13.209.177.247:8080/api/:path*',
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
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  devServer: {
    client: {
      webSocketURL: {
        hostname: process.env.NEXT_PUBLIC_BROKER_URL?.replace(/^wss?:\/\//, '') || 'localhost',
        port: '8080',
        pathname: '/ws',
        protocol: process.env.NEXT_PUBLIC_BROKER_URL?.startsWith('wss') ? 'wss' : 'ws',
      },
    },
  },
};

module.exports = nextConfig;
