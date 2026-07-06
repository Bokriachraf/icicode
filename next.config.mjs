/** @type {import('next').NextConfig} */
const nextConfig = {
  // Masque le badge "Next.js Dev Tools" (Compiling.../Route/Bundler...) en développement.
  // Purement visuel, sans effet sur la production (Vercel).
  devIndicators: false,
};

export default nextConfig;
