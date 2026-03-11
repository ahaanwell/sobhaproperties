/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:project/images/:filename',
        destination: 'https://darkblue-owl-129775.hostingersite.com/:project/images/:filename',
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
        hostname: "sobhaproperties.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.sobhaproperties.in",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "darkblue-owl-129775.hostingersite.com",
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