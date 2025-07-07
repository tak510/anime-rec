'use client'

import { useEffect, useState } from 'react'
import { getWatchedAnime } from '@/lib/supabase'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import Image from 'next/image'
import { WatchedAnime } from '@/lib/types'
import WatchedAnimeModal from '@/app/(main)/dashboard/components/WatchedAnimeModal'

export default function WatchedPage() {
  const [watchedList, setWatchedList] = useState<WatchedAnime[]>([])
  const [sortOption, setSortOption] = useState<'recent' | 'rating' | 'popularity'>('recent')
  const [selectedAnime, setSelectedAnime] = useState<WatchedAnime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await getWatchedAnime()
      setWatchedList(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const sortedList = [...watchedList].sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
    } else if (sortOption === 'rating') {
      return b.rating - a.rating
    } else if (sortOption === 'popularity') {
      return b.anilistScore - a.anilistScore
    }
    return 0
  })

  const refreshWatchedList = async () => {
    setLoading(true)
    const data = await getWatchedAnime()
    setWatchedList(data)
    setLoading(false)
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-white px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#FF5DA2] font-orbitron">Your Watched Anime</h1>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'recent' | 'rating' | 'popularity')}
            className="bg-[#2f2f31] text-white border border-[#2FFFE2] px-3 py-2 rounded font-semibold cursor-pointer"
          >
            <option value="recent">Most Recently Watched</option>
            <option value="rating">Highest Rated (by You)</option>
            <option value="popularity">Most Popular (AniList Score)</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center mt-10">Loading your watched anime...</p>
        ) : sortedList.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">No anime in your watched list yet.</p>
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
                <p className="text-sm text-gray-400">
                  ⭐ Your Rating: <span className="text-[#FF5DA2]">{anime.rating}</span>
                  <span className="text-[#FF5DA2]"> / 10</span>
                </p>
                <p className="text-sm text-[#2FFFE2]">
                  AniList Score: {anime.anilistScore / 10}/10
                </p>
              </div>
            ))}
          </div>
        )}

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