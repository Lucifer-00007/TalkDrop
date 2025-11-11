/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: __dirname,
  trailingSlash: false,
}

module.exports = nextConfig