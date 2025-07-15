'use client'

import { useEffect, useState } from 'react'
import { getWatchingAnime } from '@/lib/supabase'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import Image from 'next/image'
import { WatchingAnime } from '@/lib/types'
import WatchingAnimeModal from '@/app/(main)/dashboard/components/WatchingAnimeModal'
import SearchModal from '../components/SearchModal'

export default function WatchingPage() {
  const [watchingList, setWatchingList] = useState<WatchingAnime[]>([])
  const [sortOption, setSortOption] = useState<'started' | 'rating' | 'popularity'>('started')
  const [selectedAnime, setSelectedAnime] = useState<WatchingAnime | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await getWatchingAnime()
      setWatchingList(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const sortedList = [...watchingList].sort((a, b) => {
    if (sortOption === 'started') {
      return new Date(a.startedWatching).getTime() - new Date(b.startedWatching).getTime()
    } else if (sortOption === 'rating') {
      return b.rating - a.rating
    } else if (sortOption === 'popularity') {
      return b.anilistScore - a.anilistScore
    } else
    return 0
  })

  const refreshWatchingList = async () => {
    setLoading(true)
    const data = await getWatchingAnime()
    setWatchingList(data)
    setLoading(false)
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-white px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#FF5DA2] font-orbitron">Currently Watching</h1>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as 'started' | 'rating' | 'popularity')}
            className="bg-[#2f2f31] text-white border border-[#2FFFE2] px-3 py-2 rounded font-semibold cursor-pointer"
          >
            <option value="started">First Started Watching</option>
            <option value="rating">Highest Rated (by You)</option>
            <option value="popularity">Most Popular (AniList Score)</option>
          </select>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center mt-10">Loading your current anime...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedList.length === 0 ? (
              // Scenario 1: sortedList is empty, show only the placeholder for adding
              <div
                className="bg-[#1d1d1f] border border-dashed border-[#2FFFE2] rounded-md flex flex-col items-center justify-center hover:opacity-90 hover:scale-[1.02] cursor-pointer transition p-4 text-center col-span-full h-48" // col-span-full to center it
                onClick={() => setShowModal(true)}
              >
                <span className="text-[#FF5DA2] font-semibold text-xl">+ Add to Currently Watching</span>
                <span className="text-[#FF5DA2] text-md mt-2">You&apos;re not watching anything right now!</span>
              </div>
            ) : (
              // Scenario 2: sortedList has items, show existing anime and the "Add More" placeholder
              <>
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
                      AniList Score: {anime.anilistScore / 10} / 10
                    </p>
                  </div>
                ))}
                {/* Always show the "Add More" placeholder when there are items */}
                <div
                  className="bg-[#1d1d1f] border border-dashed border-[#2FFFE2] rounded-md flex flex-col items-center justify-center hover:opacity-90 hover:scale-[1.02] cursor-pointer transition p-4 text-center"
                  onClick={() => setShowModal(true)}
                >
                  <span className="text-[#2FFFE2] font-semibold text-sm">+ Add More</span>
                </div>
              </>
            )}
          </div>
        )}

        {showModal && (
          <SearchModal
            onClose={() => setShowModal(false)}
            mode="watching"
            onAdded={async () => {
              await refreshWatchingList()
              setShowModal(false)
            }}
          />
        )}
        {selectedAnime && (
          <WatchingAnimeModal
            anime={selectedAnime}
            onClose={() => setSelectedAnime(null)}
            onUpdate={refreshWatchingList}
          />
        )}
      </main>
    </ProtectedRoute>
  )
}