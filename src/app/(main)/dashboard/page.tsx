'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import WatchlistSection from './components/WatchlistSection'
import WatchedSection from './components/WatchedSection'
import WatchedAnimeModal from './components/WatchedAnimeModal'
import { getWatchedAnime, getWatchlistAnime } from '@/lib/supabase'
import { WatchedAnime, WatchlistAnime } from '@/lib/types'

export default function DashboardPage() {
  const [watchedList, setWatchedList] = useState<WatchedAnime[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistAnime[]>([])
  const [selectedWatchedAnime, setSelectedWatchedAnime] = useState<WatchedAnime | null>(null)
  const [selectedWatchlistAnime, setSelectedWatchlistAnime] = useState<WatchlistAnime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [watchedData, watchlistData] = await Promise.all([
          getWatchedAnime(),
          getWatchlistAnime(),
        ])

        watchedData.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
        watchlistData.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())

        setWatchedList(watchedData)
        setWatchlist(watchlistData)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshWatchedList = async () => {
    const data = await getWatchedAnime()
    data.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())
    setWatchedList(data)
  }

  const refreshWatchlist = async () => {
    const data = await getWatchlistAnime()
    data.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    setWatchlist(data)
    console.log(selectedWatchlistAnime) // Literally only here to get rid of annoying error notification
  }


  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-[#F5EDF7] px-4 py-10">
        <h1 className="text-4xl font-orbitron text-center mb-10">Your Anime Dashboard</h1>

        <div className="grid gap-12">
          <WatchlistSection
            animeList={watchlist}
            loading={loading}
            onAnimeClick={setSelectedWatchlistAnime}
            onRefresh={refreshWatchlist}
          />

          <WatchedSection
            animeList={watchedList}
            loading={loading}
            onAnimeClick={setSelectedWatchedAnime}
            onRefresh={refreshWatchedList}
          />
        </div>

        {/* Only shows the WatchedAnime modal for now */}
        {selectedWatchedAnime && (
          <WatchedAnimeModal
            anime={selectedWatchedAnime}
            onClose={() => setSelectedWatchedAnime(null)}
            onUpdate={refreshWatchedList}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}