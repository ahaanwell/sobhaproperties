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
};

export default nextConfig;