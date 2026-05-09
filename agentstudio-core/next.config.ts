import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@agentstudio/board', '@agentstudio/actions'],
}

export default nextConfig
