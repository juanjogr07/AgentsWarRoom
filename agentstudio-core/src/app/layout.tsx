import type { Metadata } from 'next'
import './globals.css'
import '@copilotkit/react-ui/styles.css'

export const metadata: Metadata = {
  title: 'AgentWarRoom',
  description: 'Engineering Command Center with Generative UI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
