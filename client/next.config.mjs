/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Optimize for faster dev builds
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
