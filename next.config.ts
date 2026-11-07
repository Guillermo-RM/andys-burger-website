import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: "/admin/:path*",
      headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "same-origin" },
        { key: "Content-Security-Policy", value: "base-uri 'none'; frame-ancestors 'none'; form-action 'self'; object-src 'none'" },
      ],
    }];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.andysburger.com" }],
        destination: "https://andysburger.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
