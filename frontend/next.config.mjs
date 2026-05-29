/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "shared.fastly.steamstatic.com",
      },
      {
        protocol: 'https',
        hostname: 'woodmart.xtemos.com',
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;