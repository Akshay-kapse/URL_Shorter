/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.pexels.com", "www.pexels.com"],
    unoptimized: true,
  },

  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { 
            key: "X-Frame-Options", value: "DENY" 
          },
          { 
            key: "X-Content-Type-Options", value: "nosniff" 
          },
          { 
            key: "Referrer-Policy", value: "origin-when-cross-origin" 
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_FRONTEND_URL || "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS"
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization"
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [];
  },

  // Disable all problematic experimental features
  experimental: {
    optimizeCss: false,       // ✅ disables lightningcss
    esmExternals: true,       // ✅ ensures ES modules work
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optional: remove next/font usage entirely to avoid lightningcss dependency
  compiler: {
    removeConsole: true,       // optional, just cleanup
  },
};

// Must use CommonJS export for Vercel/Railway builds
module.exports = nextConfig;
