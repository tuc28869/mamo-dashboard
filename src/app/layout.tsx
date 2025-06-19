import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mamo.bot Dashboard | Business Intelligence Analytics',
  description: 'Comprehensive business intelligence dashboard for Mamo.bot platform analytics, user metrics, and financial performance tracking.',
  keywords: 'Mamo, dashboard, analytics, crypto, DeFi, business intelligence',
  authors: [{ name: 'Mamo Team' }],
  // Remove viewport from here
}

// Add this separate viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} dashboard-container`}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  Mamo.bot Analytics
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  v{process.env.NEXT_PUBLIC_VERSION || '1.0.0'}
                </span>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" 
                     title="Live Data"></div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        <footer className="bg-gray-50 border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              © 2024 Mamo.bot Dashboard. Real-time business intelligence for crypto platforms.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}