/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost', '127.0.0.1'],
    formats: ['image/webp', 'image/avif'],
  },
  // Allow cross-origin requests from Replit dev environment
  allowedDevOrigins: ['*.replit.dev'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Configure for Replit
  serverExternalPackages: ['prisma', '@prisma/client'],
};

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);

module.exports = config;