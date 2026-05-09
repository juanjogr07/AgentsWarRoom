import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const stripUseClient = {
  name: 'strip-use-client',
  transform(code: string, id: string) {
    if (id.endsWith('.tsx') || id.endsWith('.ts'))
      return { code: code.replace(/^['"]use client['"]\s*\n/m, '') }
  },
}

export default defineConfig({
  plugins: [stripUseClient, react()],
  server: { port: 5173 },
})
