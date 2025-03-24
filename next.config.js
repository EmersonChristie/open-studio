/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure images domains if needed
  images: {
    domains: ['images.unsplash.com'],
    // Enable image optimization
    unoptimized: false,
  },
  // Disable the X-Powered-By header for security
  poweredByHeader: false,
  // Improve output tracing for better production deployments
  output: 'standalone',
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/demo-gallery/dashboard', // Default redirect to demo gallery
        permanent: false,
      },
    ]
  },
  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
