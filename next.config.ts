
import type { NextConfig } from "next";

const authApiUrl =
  process.env.AUTH_API_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    return [
      // Better Auth proxy
      {
        source: "/api/auth/:path*",
        destination: `${authApiUrl}/api/auth/:path*`,
      },

      // Protected API proxy (appointments, bookings, profiles, etc.)
      {
        source: "/api/protected/:path*",
        destination: `${authApiUrl}/api/protected/:path*`,
      },

      // Payment API proxy (Stripe Checkout, etc.)
      {
        source: "/api/payment/:path*",
        destination: `${authApiUrl}/api/payment/:path*`,
      },

      // Image upload API proxy
      {
        source: "/api/upload/:path*",
        destination: `${authApiUrl}/api/upload/:path*`,
      },

      // Admin transactions API proxy
      {
        source: "/api/admin/transactions/:path*",
        destination: `${authApiUrl}/api/admin/transactions/:path*`,
      },
    ];
  },
};

export default nextConfig;
