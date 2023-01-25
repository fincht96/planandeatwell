/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/create-plan/supermarket',
        permanent: true,
      },
    ];
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  images: {
    domains: [
      'newstack.fra1.digitaloceanspaces.com',
      'newstack.fra1.cdn.digitaloceanspaces.com',
    ],
  },

  output: 'standalone',
};

module.exports = nextConfig;
