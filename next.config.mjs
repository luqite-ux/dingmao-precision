/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-c7a22068052144a5805830c30d280128.r2.dev',
        pathname: '/tenants/dingmao-precision/**',
      },
    ],
  },
}

export default nextConfig
