'use client'

import { useState } from 'react'
import AnimeCard from './AnimeCard'
import { WatchedAnime } from '@/lib/types'
import WatchedModal from './WatchedModal'

type WatchedSectionProps = {
  animeList: WatchedAnime[]
}

export default function WatchedSection({ animeList }: WatchedSectionProps) {

  const [showModal, setShowModal] = useState(false)

  // Only show first 7 entries
  const limitedList = (animeList ?? []).slice(0, 7)

  return (
    <>
      {showModal && <WatchedModal onClose={() => setShowModal(false)} />}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#FF5DA2] font-orbitron">Watched Anime</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
          {limitedList.map((anime) => (
            <AnimeCard
              key={anime.id}
              id={anime.id}
              title={anime.title}
              imageUrl={anime.imageUrl}
              rating={anime.rating}
            />
          ))}

          {/* "View All / Add More" Placeholder Card */}
          <div
            className="bg-[#1d1d1f] border border-dashed border-[#2FFFE2] rounded-md flex flex-col items-center justify-center hover:opacity-90 hover:scale-[1.02] cursor-pointer transition p-4 text-center"
            onClick={() => setShowModal(true)}
          >
            <span className="text-[#2FFFE2] font-semibold text-sm">+ Add More</span>
            <span className="text-[#2FFFE2] text-xs mt-1">or View All</span>
          </div>
        </div>
      </section>
    </>
  )
}