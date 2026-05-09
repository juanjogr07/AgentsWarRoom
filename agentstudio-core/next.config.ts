import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@agentstudio/board', '@agentstudio/actions'],
  webpack: (config) => {
    config.resolve.symlinks = false
    return config
  },
  turbopack: {
    resolveAlias: {
      '@agentstudio/board': '../agentstudio-board/dist/index.js',
      '@agentstudio/actions': '../agentstudio-actions/dist/index.js',
    },
  },
}

export default nextConfig
