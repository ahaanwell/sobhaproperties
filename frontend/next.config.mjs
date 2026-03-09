/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // ← disables Next.js image optimization
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.sobhaproperties.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.sobhaproperties.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;