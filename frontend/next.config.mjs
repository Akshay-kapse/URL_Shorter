/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better hosting compatibility
  output: 'standalone',
  
  // Image optimization settings
  images: {
    domains: ['images.pexels.com', 'www.pexels.com'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  
  // Environment variables
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXT_PUBLIC_FRONTEND_URL: process.env.FRONTEND_URL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  
  // Headers for security
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
};

export default nextConfig;
