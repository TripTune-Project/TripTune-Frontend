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
  // todo : 이걸 써야할지 말지를 모르겠음
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.209.177.247:8080/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
