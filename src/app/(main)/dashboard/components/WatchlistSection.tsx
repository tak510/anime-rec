'use client'

import { useState } from 'react'
import AnimeCard from './AnimeCard'
import { WatchlistAnime } from '@/lib/types'
import SearchModal from './SearchModal'

type WatchlistSectionProps = {
  animeList: WatchlistAnime[]
  loading: boolean
  onAnimeClick: (anime: WatchlistAnime) => void
  onRefresh: () => void
}

export default function WatchlistSection({
  animeList,
  loading,
  onAnimeClick,
  onRefresh,
}: WatchlistSectionProps) {
  const [showModal, setShowModal] = useState(false)

  const limitedList = animeList.slice(0, 7)

  return (
    <>
      {showModal && <SearchModal onClose={() => setShowModal(false)} mode="watchlist" dashboard onAdded={onRefresh}/>}

      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#2FFFE2] font-orbitron">
            Anime on Your Watchlist
          </h2>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center mt-4">Loading your watchlist...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
            {limitedList.map((anime) => (
              <AnimeCard
                key={anime.id}
                id={anime.id}
                title={anime.title}
                imageUrl={anime.imageUrl}
                onClick={() => onAnimeClick(anime)}
              />
            ))}

            {/* Placeholder Card: always shown */}
            <div
              className="bg-[#1d1d1f] border border-dashed border-[#2FFFE2] rounded-md flex flex-col items-center justify-center hover:opacity-90 hover:scale-[1.02] cursor-pointer transition p-4 text-center"
              onClick={() => setShowModal(true)}
            >
              {animeList.length === 0 ? (
                <>
                  <span className="text-[#FF5DA2] font-semibold text-sm">+ Start Adding Anime</span>
                  <span className="text-[#FF5DA2] text-xs mt-1">Nothing here yet</span>
                </>
              ) : (
                <>
                  <span className="text-[#2FFFE2] font-semibold text-sm">+ Add More</span>
                  <span className="text-[#2FFFE2] text-xs mt-1">or View All</span>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  )
}