'use client'

import { useEffect, useState } from 'react'
import { getWatchlistAnime } from '@/lib/supabase'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import Image from 'next/image'
import { WatchlistAnime } from '@/lib/types'
import WatchlistAnimeModal from '@/app/(main)/dashboard/components/WatchlistAnimeModal'
import SearchModal from '../components/SearchModal'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistAnime[]>([])
  const [sortOption, setSortOption] = useState<'oldest' | 'recent' | 'popularity'>('oldest')
  const [selectedAnime, setSelectedAnime] = useState<WatchlistAnime | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await getWatchlistAnime()
      setWatchlist(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const sortedList = [...watchlist].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    } else if (sortOption === 'popularity') {
      return b.anilistScore - a.anilistScore
    } else if (sortOption === 'oldest') {
      return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
    } else 
    return 0
  })

  const refreshWatchlist = async (newAnime?: WatchlistAnime) => {
    if (newAnime) {
      setWatchlist((prev) => {
        const exists = prev.some((a) => a.id === newAnime.id)
        if (exists) return prev
        return [newAnime, ...prev]
      })
      return
    }

    setLoading(true)
    const data = await getWatchlistAnime()
    setWatchlist(data)
    setLoading(false)
  }


  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-white px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#2FFFE2] font-orbitron">Your Watchlist</h1>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'oldest' | 'recent' | 'popularity')}
            className="bg-[#2f2f31] text-white border border-[#FF5DA2] px-3 py-2 rounded font-semibold cursor-pointer"
          >
            <option value="oldest">Oldest Added</option>
            <option value="recent">Most Recently Added</option>
            <option value="popularity">Most Popular (AniList Score)</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center mt-10">Loading your watchlist...</p>
        ) : sortedList.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No anime in your watchlist yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedList.map((anime) => (
              <div
                key={anime.id}
                onClick={() => setSelectedAnime(anime)}
                className="bg-[#2f2f31] p-3 rounded-md shadow hover:scale-[1.02] cursor-pointer transition duration-200"
              >
                <div className="relative w-full h-[270px] mb-2 rounded overflow-hidden">
                  <Image
                    src={anime.imageUrl}
                    alt={anime.title}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <h3 className="text-md font-semibold truncate">{anime.title}</h3>
                <p className="text-sm text-[#2FFFE2]">
                  AniList Score: {anime.anilistScore / 10} / 10
                </p>
              </div>
            ))}
            {showModal && <SearchModal
              onClose={() => setShowModal(false)}
              mode="watchlist"
              onAdded={async () => {
                await refreshWatchlist()
                setShowModal(false)
              }}
            />
            }

        {/* Placeholder Card: always shown */}
            <div
              className="bg-[#1d1d1f] border border-dashed border-[#FF5DA2] rounded-md flex flex-col items-center justify-center hover:opacity-90 hover:scale-[1.02] cursor-pointer transition p-4 text-center"
              onClick={() => setShowModal(true)}
            >
              {sortedList.length === 0 ? (
                <>
                  <span className="text-[#2FFFE2] font-semibold text-sm">+ Add to watchlist</span>
                  <span className="text-[#2FFFE2] text-xs mt-1">Nothing here yet</span>
                </>
              ) : (
                <>
                  <span className="text-[#FF5DA2] font-semibold text-sm">+ Add More</span>
                </>
              )}
            </div>
          </div>
        )}

        {selectedAnime && (
          <WatchlistAnimeModal
            anime={selectedAnime}
            onClose={() => setSelectedAnime(null)}
            onUpdate={refreshWatchlist}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}