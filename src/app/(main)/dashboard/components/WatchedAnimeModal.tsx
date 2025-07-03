'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { WatchedAnime } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type WatchedAnimeModalProps = {
  anime: WatchedAnime
  onClose: () => void
}

export default function WatchedAnimeModal({
  anime,
  onClose,
}: WatchedAnimeModalProps) {
  const [newRating, setNewRating] = useState<number>(anime.rating)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUserId = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!error && data.user) {
        setUserId(data.user.id)
      }
    }
    getUserId()
  }, [])

  const handleUpdateRating = async () => {
    if (!userId) return
    try {
      await supabase
        .from('anime_entries')
        .update({ rating: newRating })
        .eq('user_id', userId)
        .eq('anilist_id', anime.id)

      alert('✅ Rating updated!')
      onClose()
    } catch (err) {
      alert('❌ Failed to update rating.')
      console.error(err)
    }
  }

  const handleRemove = async () => {
    if (!userId) return
    const confirmDelete = window.confirm('Are you sure you want to remove this anime from your watched list?')
    if (!confirmDelete) return

    try {
      await supabase
        .from('anime_entries')
        .delete()
        .eq('user_id', userId)
        .eq('anilist_id', anime.id)

      alert('❌ Anime removed from your watched list.')
      onClose()
    } catch (err) {
      alert('Failed to remove anime.')
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#1D1D1F] text-white rounded-lg shadow-xl w-full max-w-2xl relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white text-2xl hover:opacity-80"
        >
          ×
        </button>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Anime Image */}
          <div className="relative w-full max-w-[180px] h-[260px] mx-auto md:mx-0">
            <Image
              src={anime.imageUrl}
              alt={anime.title}
              fill
              className="object-cover rounded"
              sizes="180px"
            />
          </div>

          {/* Info + Rating */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#FF5DA2] font-orbitron mb-2">
              {anime.title}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed max-h-[140px] overflow-y-auto pr-1 mb-4">
              {anime.description || 'No description available.'}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Rating:</label>
              <input
                type="number"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                min={0}
                max={100}
                className="w-24 p-2 rounded bg-[#2f2f31] border border-[#2FFFE2] text-white"
              />
              <button
                onClick={handleUpdateRating}
                className="ml-4 px-4 py-2 bg-[#FF5DA2] text-white rounded hover:opacity-90 transition"
              >
                Update Rating
              </button>
            </div>

            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Remove from Watched List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}