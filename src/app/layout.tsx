import type { Metadata } from 'next'
import { Lora } from 'next/font/google'
import './globals.css'

const lora = Lora({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'SoloLaunch Checklist',
  description: 'Pre-launch readiness checker for solo developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={lora.variable}>
      <body className={`${lora.className} antialiased`}>{children}</body>
    </html>
  )
}