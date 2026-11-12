/** @type {import('next').NextConfig} */
const nextConfig = {
  // The project has no ESLint setup; type errors still fail the build.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // These pages were removed. Permanent redirects keep old links and search results working.
  async redirects() {
    return [
      { source: "/startups/:path*", destination: "/", permanent: true },
      { source: "/seedfund/:path*", destination: "/", permanent: true },
      { source: "/surprise/:path*", destination: "/", permanent: true },
    ]
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

export default nextConfig
