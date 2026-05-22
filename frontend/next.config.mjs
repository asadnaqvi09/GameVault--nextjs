/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  reactCompiler: true,
  // 👇 Add this experimental block below
  experimental: {
    allowedDevOrigins: ['192.168.1.74'],
  },
};

export default nextConfig;
