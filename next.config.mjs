/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'], // In case we need to load external images
  },
  env: {
    NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY,
  },
}

export default nextConfig;