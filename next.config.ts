import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "/home",
      permanent: true,
    },
  ],
  /* other config options here */
};

export default nextConfig;
