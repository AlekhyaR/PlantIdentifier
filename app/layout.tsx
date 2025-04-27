import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import WaveGradientBackground from './components/WaveGradientBackground';
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'PlantID - Identify any plant instantly',
  description: 'Upload a photo of any plant and get instant identification using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <WaveGradientBackground>
          {children}
        </WaveGradientBackground>
      </body>
    </html>
  )
}