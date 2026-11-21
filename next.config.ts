
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

      // Protected API proxy (appointments, bookings, etc.)
      {
        source: "/api/protected/:path*",
        destination: `${authApiUrl}/api/protected/:path*`,
      },
    ];
  },
};

export default nextConfig;
