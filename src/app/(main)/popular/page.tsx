'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { fetchPopularAnime } from '@/lib/anilist'

type Anime = {
  id: number
  title: { userPreferred: string }
  coverImage: { large: string }
  averageScore: number
  genres: string[]
}

export default function PopularPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([])

  useEffect(() => {
    fetchPopularAnime(1, 20).then(setAnimeList)
  }, [])

  if (animeList.length === 0) return <p className="pt-20 text-center text-gray-400">Loading popular anime...</p>

  return (
    <main className="bg-[#1D1D1F] text-[#F5EDF7] min-h-screen px-4 md:px-12 py-10 font-inter">
      <h1 className="text-4xl font-orbitron text-center mb-10 text-[#FF5DA2]">Popular Anime</h1>

      {/* Top 10 carousel */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-[#2FFFE2]">Top 10</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {animeList.slice(0, 10).map((anime, idx) => (
            <div key={anime.id} className="min-w-[200px] bg-[#2f2f31] rounded-lg overflow-hidden border border-[#FF5DA2]">
              <Image src={anime.coverImage.large} alt={anime.title.userPreferred} width={200} height={300} className="object-cover" />
              <div className="p-3">
                <p className="text-lg font-semibold text-[#FF5DA2]">{idx + 1}. {anime.title.userPreferred}</p>
                <p className="text-sm text-[#2FFFE2]">⭐ {anime.averageScore / 10}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-[#2FFFE2]">All Popular Anime</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animeList.map(anime => (
            <div key={anime.id} className="bg-[#2f2f31] rounded-lg overflow-hidden border border-[#6B4CA0] hover:scale-105 transition">
              <Image src={anime.coverImage.large} alt={anime.title.userPreferred} width={300} height={400} className="object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-semibold">{anime.title.userPreferred}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}