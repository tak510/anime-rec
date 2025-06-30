'use client'

import { useState } from 'react'
import AnimeCard from './AnimeCard'

type WatchedAnime = {
  id: string
  title: string
  imageUrl: string
  rating: number
  watchedAt: string
}


/* Will populate with real data later */
const dummyWatched: WatchedAnime[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg',
    rating: 9,
    watchedAt: '2024-06-01',
  },
  {
    id: '2',
    title: 'Steins;Gate',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9253-OdCQaF1Z3GO1.jpg',
    rating: 10,
    watchedAt: '2024-05-20',
  },
  {
    id: '3',
    title: 'Cyberpunk: Edgerunners',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx14647-kxD5V7HrfczO.png',
    rating: 8,
    watchedAt: '2024-06-10',
  },
]

export default function WatchedSection() {
  const [sort, setSort] = useState<'recent' | 'rating'>('recent')

  const sortedAnime = [...dummyWatched].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating
    return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()
  })

  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#FF5DA2] font-orbitron">Your Watched Anime</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'recent' | 'rating')}
          className="bg-[#1D1D1F] border border-[#2FFFE2] text-white px-3 py-1 rounded"
        >
          <option value="recent">Recently Watched</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {sortedAnime.map((anime) => (
          <AnimeCard
            key={anime.id}
            id={anime.id}
            title={anime.title}
            imageUrl={anime.imageUrl}
            rating={anime.rating}
          />
        ))}
      </div>
    </section>
  )
}