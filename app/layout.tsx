import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import StructuredData from './components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Is it on Hydra?',
  description: 'Fast and reliable game search engine. Find games across multiple sources, with advanced filtering and sorting capabilities. Always up-to-date with the latest releases.',
  keywords: 'game search, hydra launcher, game downloads, game finder, hydralinks',
  openGraph: {
    title: 'Is it on Hydra?',
    description: 'Fast and reliable game search engine with advanced filtering capabilities',
    url: 'https://isitonhydra.xyz',
    siteName: 'Is it on Hydra?',
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'Is it on Hydra Preview'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is it on Hydra? - Game Search Engine',
    description: 'Fast and reliable game search engine with advanced filtering capabilities',
    images: ['/preview.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://isitonhydra.xyz" />
        <StructuredData />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

