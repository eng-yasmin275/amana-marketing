import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://*.tile.openstreetmap.org;
      style-src 'self' 'unsafe-inline' https://unpkg.com https://*.tile.openstreetmap.org;
      img-src * blob: data:;
      connect-src *;
      font-src 'self' data:;
    `.replace(/\s{2,}/g, " ").trim(),
  },
];



export default nextConfig;

