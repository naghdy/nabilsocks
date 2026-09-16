import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/product/pulse-ankle",
        destination: "/product/pulse-crew",
        permanent: true,
      },
      {
        source: "/product/glacier-no-show",
        destination: "/product/glacier-crew",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
