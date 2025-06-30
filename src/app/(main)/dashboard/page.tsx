'use client'

import ProtectedRoute from '@/app/components/ProtectedRoute'
import WatchlistSection from './components/WatchlistSection'
import WatchedSection from './components/WatchedSection'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-[#F5EDF7] px-4 py-10">
        <h1 className="text-4xl font-orbitron text-center mb-10">Your Anime Dashboard</h1>
        <div className="grid gap-12">
          <WatchlistSection />
          <WatchedSection />
        </div>
      </main>
    </ProtectedRoute>
  )
}