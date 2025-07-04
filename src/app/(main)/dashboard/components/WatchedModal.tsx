'use client'

import { useEffect, useState } from 'react'
import { fetchAnimeSearch } from '@/lib/anilist'
import { addToWatched } from '@/lib/supabase'
import Image from 'next/image'

type WatchedModalProps = {
  onClose: () => void
}

type AnimeSearchResult = {
  id: number
  title: { userPreferred: string }
  coverImage: { large: string }
  averageScore?: number
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

export default function WatchedModal({ onClose }: WatchedModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AnimeSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState<number | null>(null)

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    const search = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const animeList: AnimeSearchResult[] = await fetchAnimeSearch(debouncedQuery)
        setResults(animeList)
        if (animeList.length === 0) {
          setError('No anime found.')
        }
      } catch (err) {
        console.error('Search failed:', err)
        setError('Failed to fetch results.')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  const handleAdd = async (anime: AnimeSearchResult) => {
    try {
      setAdding(anime.id)
      await addToWatched({
        anilistId: anime.id,
        rating: anime.averageScore ?? undefined,
      })
      alert(`✅ Added "${anime.title.userPreferred}" to your watched list.`)
      setQuery('')
      setResults([])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unknown error occurred.'
      alert(`❌ Failed to add anime: ${errorMsg}`)
      console.error(errorMsg)
    } finally {
      setAdding(null)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-[#1D1D1F] text-white p-6 rounded-lg w-full max-w-xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:opacity-80 cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4">Add to Watched List</h2>

        <input
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded bg-[#2f2f31] text-white border border-[#2FFFE2] mb-4"
          disabled={loading}
        />

        <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {loading && <p className="text-sm text-gray-400 px-2">Searching...</p>}
          {error && <p className="text-sm text-red-400 px-2">{error}</p>}
          {!loading && !error && results.map((anime) => (
            <li
              key={anime.id}
              className="flex items-center justify-between bg-[#2f2f31] p-3 rounded hover:bg-[#2FFFE2]/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-16 rounded overflow-hidden">
                  <Image
                    src={anime.coverImage.large}
                    alt={anime.title.userPreferred}
                    fill
                    className="object-cover rounded"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{anime.title.userPreferred}</p>
                  <p className="text-xs text-gray-400">Score: {anime.averageScore ?? 'N/A'}</p>
                </div>
              </div>

              <button
                disabled={adding === anime.id}
                onClick={() => handleAdd(anime)}
                className="bg-[#2FFFE2] text-black text-sm px-3 py-1 rounded hover:bg-opacity-80 transition disabled:opacity-50"
              >
                {adding === anime.id ? 'Adding...' : 'Add'}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="mt-6 w-full bg-[#FF5DA2] text-white font-semibold py-2 rounded hover:opacity-90 transition cursor-pointer"
          onClick={() => {
            onClose()
            window.location.href = '/dashboard/watched'
          }}
        >
          View Full Watched List
        </button>
      </div>
    </div>
  )
}