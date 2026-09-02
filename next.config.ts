/** @type {import('next').NextConfig} */
const nextConfig = {
  // Arsitektur Performa Kilat: Image Optimization & Edge CDN
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 tahun di Edge CDN
    qualities: [75, 85],
  },
  
  // HTTP Headers untuk Vercel Edge Caching & Aset Statis
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Updated to use new Next.js 15/16 config option
  serverExternalPackages: ['@prisma/client'],
  
  // Allow ngrok cross-origin requests
  allowedDevOrigins: [
    'hexaemeric-jaida-unbuffed.ngrok-free.dev'
  ]
};

module.exports = nextConfig;