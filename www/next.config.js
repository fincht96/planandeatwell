/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: [
      'newstack.fra1.digitaloceanspaces.com',
      'newstack.fra1.cdn.digitaloceanspaces.com',
    ],
  },
};

module.exports = nextConfig;
