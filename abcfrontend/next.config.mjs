/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: 'https://res.cloudinary.com/dmz316wxm/image/upload/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sobhaproperties.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.sobhaproperties.in",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;