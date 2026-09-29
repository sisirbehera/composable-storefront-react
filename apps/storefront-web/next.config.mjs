/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@storefront/core',
    '@storefront/api',
    '@storefront/ui',
    '@storefront/cms',
    '@storefront/auth',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
