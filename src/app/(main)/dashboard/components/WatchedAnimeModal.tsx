'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WatchedAnime } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type WatchedAnimeModalProps = {
  anime: WatchedAnime
  onClose: () => void
  onSave?: (newRating: number) => Promise<void>
}

export default function WatchedAnimeModal({
  anime,
  onClose,
  onSave,
}: WatchedAnimeModalProps) {
  const [newRating, setNewRating] = useState<string>(anime.rating.toString())

  const handleUpdateRating = async () => {
  const parsedRating = Number(newRating)
  if (parsedRating < 1 || parsedRating > 10) {
    alert('Rating must be between 1 and 10.')
    return
  }

  try {
    if (onSave) {
      await onSave(parsedRating)
    }

    alert('✅ Rating updated!')
    onClose()
  } catch (err) {
    alert('❌ Failed to update rating.')
    console.error(err)
  }
}

  const handleRemove = async () => {
    const confirmRemove = window.confirm(
      'Are you sure you want to remove this anime from your watched list?'
    )
    if (!confirmRemove) return

    try {
      const { data: userData } = await supabase.auth.getUser()
      await supabase
        .from('anime_entries')
        .delete()
        .eq('user_id', userData.user?.id)
        .eq('anilist_id', anime.id)

      alert('❌ Anime removed from your watched list.')
      onClose()
    } catch (err) {
      alert('Failed to remove anime.')
      console.error(err)
    }
  }

  // Clean up basic HTML tags
  const cleanDescription = anime.description?.replace(/<br\s*\/?>/gi, '\n').replace(/<\/?[^>]+(>|$)/g, '') || 'No description available.'

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
            <p className="text-sm text-gray-300 leading-relaxed max-h-[140px] overflow-y-auto pr-1 whitespace-pre-wrap mb-4">
              {cleanDescription}
            </p>

            <div className="mt-4 mb-4">
              <label className="block text-sm font-medium mb-1">Your Rating:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={newRating}
                  onChange={(e) => {
                    const value = e.target.value
                    // Allow empty value for typing
                    if (value === '' || (/^\d+$/.test(value) && +value <= 10)) {
                      setNewRating(value)
                    }
                  }}
                  placeholder="e.g. 8"
                  className="w-20 p-2 rounded bg-[#2f2f31] border border-[#2FFFE2] text-white text-center"
                />
                <span className="text-sm text-gray-400">/ 10</span>
              </div>
              <button
                onClick={handleUpdateRating}
                className="mt-3 px-4 py-2 bg-[#FF5DA2] text-white rounded hover:opacity-90 transition cursor-pointer"
              >
                Update Rating
              </button>
            </div>

            <button
              onClick={handleRemove}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
            >
              Remove from Watched List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}