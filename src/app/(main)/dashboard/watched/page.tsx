'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { supabase } from '@/lib/supabase'
import { fetchAnimeByIds } from '@/lib/anilist'
import type { Anime } from '@/lib/types'
import Image from 'next/image'

export default function WatchedPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchWatched = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser()
        if (userError || !userData.user) {
          setError('You must be logged in to view this page.')
          router.push('/login')
          return
        }

        const { data: entries, error: entriesError } = await supabase
          .from('anime_entries')
          .select('anilist_id')
          .eq('user_id', userData.user.id)
          .eq('status', 'completed')

        if (entriesError) throw new Error(entriesError.message)

        const ids = entries.map(entry => entry.anilist_id)
        if (ids.length > 0) {
          const animeData: Anime[] = await fetchAnimeByIds(ids)
          setAnimeList(animeData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    fetchWatched()
  }, [router])

  return (
    <ProtectedRoute>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Your Watched Anime</h1>
        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && animeList.length === 0 && (
          <p className="text-gray-400">You haven’t added any completed anime yet.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {animeList.map((anime) => (
            <div
              key={anime.id}
              className="bg-[#1d1d1f] p-3 rounded shadow hover:shadow-lg transition"
            >
              <div className="relative w-full h-48 mb-2">
                <Image
                  src={anime.coverImage.large}
                  alt={anime.title.userPreferred}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
              </div>
              <h3 className="text-sm font-medium text-white truncate">
                {anime.title.userPreferred}
              </h3>
            </div>
          ))}
        </div>
      </main>
    </ProtectedRoute>
  )
}