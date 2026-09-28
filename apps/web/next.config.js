/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@edunet/ui', '@edunet/auth', '@edunet/api-client'],
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
