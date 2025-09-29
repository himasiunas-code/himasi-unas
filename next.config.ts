/** @type {import('next').NextConfig} */
const nextConfig = {
  // Commented out 'output: export' because it's incompatible with API routes
  // output: 'export',  // Enable for static export only
  images: {
    unoptimized: true,
  },
  // Updated to use new Next.js 15 config option
  serverExternalPackages: ['@prisma/client'],
  
  // Allow ngrok cross-origin requests
  allowedDevOrigins: [
    'hexaemeric-jaida-unbuffed.ngrok-free.dev'
  ]
};

module.exports = nextConfig;