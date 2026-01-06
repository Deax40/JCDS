/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // Domaines autorisés pour les images externes
    domains: [
      'localhost',
      'res.cloudinary.com', // Si vous utilisez Cloudinary
      'vercel.app',
      'themeim.com' // Pour les images du template de démo
    ],
    // Formats d'images modernes (WebP, AVIF)
    formats: ['image/avif', 'image/webp'],
    // Tailles d'images générées automatiquement
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache des images optimisées (en secondes)
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 an
    // Désactiver l'optimisation seulement en dev pour développement plus rapide
    // En production, TOUJOURS optimiser
    unoptimized: false
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    PLATFORM_COMMISSION: process.env.PLATFORM_COMMISSION || '10'
  }
}

module.exports = nextConfig
