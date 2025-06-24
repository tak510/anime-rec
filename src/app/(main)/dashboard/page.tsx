'use client'

import ProtectedRoute from '@/app/components/ProtectedRoute'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen p-10 bg-[#1D1D1F] text-[#F5EDF7] font-inter">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <p className="text-lg">This is your personal space. Here’s where you’ll see your watch history, preferences, and more.</p>

        <div className="mt-8 p-6 border border-[#2FFFE2] rounded bg-[#2f2f31]">
          <p className="text-sm text-gray-300">
            Dashboard features under construction.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}