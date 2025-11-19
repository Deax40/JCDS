/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com', // Si vous utilisez Cloudinary
      'vercel.app',
      'themeim.com' // Pour les images du template de démo
    ],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    PLATFORM_COMMISSION: process.env.PLATFORM_COMMISSION || '10'
  }
}

module.exports = nextConfig
