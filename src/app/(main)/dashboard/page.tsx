'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import WatchlistSection from './components/WatchlistSection'
import WatchedSection from './components/WatchedSection'
import WatchedAnimeModal from './components/WatchedAnimeModal'
import { getWatchedAnime } from '@/lib/supabase'
import { WatchedAnime } from '@/lib/types'

export default function DashboardPage() {
  const [watchedList, setWatchedList] = useState<WatchedAnime[]>([])
  const [selectedAnime, setSelectedAnime] = useState<WatchedAnime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getWatchedAnime()
        setWatchedList(data)
      } catch (err) {
        console.error('Failed to fetch watched anime:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshWatchedList = async () => {
    const data = await getWatchedAnime()
    setWatchedList(data)
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-[#F5EDF7] px-4 py-10">
        <h1 className="text-4xl font-orbitron text-center mb-10">Your Anime Dashboard</h1>
        <div className="grid gap-12">
          <WatchlistSection />
          <WatchedSection
            animeList={watchedList}
            loading={loading}
            onAnimeClick={setSelectedAnime}
          />
        </div>

        {selectedAnime && (
          <WatchedAnimeModal
            anime={selectedAnime}
            onClose={() => setSelectedAnime(null)}
            onUpdate={refreshWatchedList}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}