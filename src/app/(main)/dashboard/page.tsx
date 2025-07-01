'use client'

import ProtectedRoute from '@/app/components/ProtectedRoute'
import WatchlistSection from './components/WatchlistSection'
import WatchedSection from './components/WatchedSection'
import { WatchedAnime } from '@/lib/types'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-[#1D1D1F] text-[#F5EDF7] px-4 py-10">
        <h1 className="text-4xl font-orbitron text-center mb-10">Your Anime Dashboard</h1>
        <div className="grid gap-12">
          <WatchlistSection />
          <WatchedSection animeList={dummyWatchedAnime}/>
        </div>
      </main>
    </ProtectedRoute>
  )
}

const dummyWatchedAnime: WatchedAnime[] = [
  {
    id: '1',
    title: 'Attack on Titan',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-buvcRTBx4NSm.jpg',
    rating: 9,
    watchedAt: '2024-03-01'
  },
  {
    id: '2',
    title: 'Jujutsu Kaisen',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-X2LhZdbk1Z3O.jpg',
    rating: 8.5,
    watchedAt: '2024-02-20'
  },
  {
    id: '3',
    title: 'Cyberpunk: Edgerunners',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145272-Qz8AfZKzvIzT.png',
    rating: 9.2,
    watchedAt: '2024-01-15'
  },
  {
    id: '4',
    title: 'Vinland Saga',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101348-Y92pT9XyM8Rg.jpg',
    rating: 8.7,
    watchedAt: '2023-12-10'
  },
  {
    id: '5',
    title: 'Chainsaw Man',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx127230-pK6fF9fYY2fr.jpg',
    rating: 8.9,
    watchedAt: '2023-11-02'
  },
  {
    id: '6',
    title: 'Demon Slayer',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PpHgEJeX3uGu.jpg',
    rating: 8.4,
    watchedAt: '2023-10-12'
  },
  {
    id: '7',
    title: 'Mob Psycho 100',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21507-oeIxxHfOdYvT.jpg',
    rating: 9.1,
    watchedAt: '2023-09-21'
  },
  {
    id: '8',
    title: 'Steins;Gate',
    imageUrl: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-SY9gHYzCBO5j.jpg',
    rating: 9.5,
    watchedAt: '2023-08-30'
  }
]