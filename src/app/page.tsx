'use client'

import { Suspense } from 'react'
import ExecutiveDashboard from './components/dashboard/ExecutiveDashboard'

// Loading component for better UX
function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse h-64 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
      <div className="animate-pulse h-96 bg-gray-200 rounded-lg"></div>
    </div>
  )
}

// Error boundary component
function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Error
        </h2>
        <p className="text-gray-600 mb-6">
          Something went wrong loading the dashboard: {error.message}
        </p>
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Intelligence Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor Mamo.bot platform performance, user engagement, and financial metrics in real-time.
          </p>
        </div>
        
        <Suspense fallback={<DashboardLoading />}>
          <ExecutiveDashboard />
        </Suspense>
      </div>
    </div>
  )
}