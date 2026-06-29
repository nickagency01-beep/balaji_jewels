import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.lumora.com" },
    ],
  },
  serverExternalPackages: ["bcryptjs", "@prisma/client"],
};

export default nextConfig;
