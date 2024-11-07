import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/page1",
        permanent: true,
      },
    ];
  },
  /* other config options here */
};

export default nextConfig;
