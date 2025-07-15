'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import WatchlistSection from './components/WatchlistSection'
import WatchedSection from './components/WatchedSection'
import WatchedAnimeModal from './components/WatchedAnimeModal'
import WatchingAnimeModal from './components/WatchingAnimeModal'
import { getWatchedAnime, getWatchingAnime, getWatchlistAnime } from '@/lib/supabase'
import { WatchedAnime, WatchingAnime, WatchlistAnime } from '@/lib/types'
import WatchlistAnimeModal from './components/WatchlistAnimeModal'
import WatchingSection from './components/WatchingSection'

export default function DashboardPage() {
  const [watchedList, setWatchedList] = useState<WatchedAnime[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistAnime[]>([])
  const [watchinglist, setWatchinglist] = useState<WatchingAnime[]>([])
  const [selectedWatchedAnime, setSelectedWatchedAnime] = useState<WatchedAnime | null>(null)
  const [selectedWatchlistAnime, setSelectedWatchlistAnime] = useState<WatchlistAnime | null>(null)
  const [selectedWatchingAnime, setSelectedWatchingAnime] = useState<WatchingAnime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [watchedData, watchlistData, watchingData] = await Promise.all([
          getWatchedAnime(),
          getWatchlistAnime(),
          getWatchingAnime(),
        ])

        watchedData.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime())

        setWatchedList(watchedData)
        setWatchlist(watchlistData)
        setWatchinglist(watchingData)
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
    setWatchlist(data)
  }

  const refreshWatchinglist = async () => {
    const data = await getWatchingAnime()
    setWatchinglist(data)
  }


  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-[#F5EDF7] px-4 py-10">
        <h1 className="text-4xl font-orbitron text-center mb-10">Your Anime Dashboard</h1>

        <div className="grid gap-12">
          <WatchingSection
            animeList={watchinglist}
            loading={loading}
            onAnimeClick={setSelectedWatchingAnime}
            onRefresh={refreshWatchinglist}
          />

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

        {selectedWatchlistAnime && (
          <WatchlistAnimeModal
            anime={selectedWatchlistAnime}
            onClose={() => setSelectedWatchlistAnime(null)}
            onUpdate={refreshWatchlist}
          />
        )}

        {selectedWatchingAnime && (
          <WatchingAnimeModal
            anime={selectedWatchingAnime}
            onClose={() => setSelectedWatchingAnime(null)}
            onUpdate={refreshWatchinglist}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}