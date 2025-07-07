'use client'

import { useState } from 'react'
import Image from 'next/image'
import { WatchedAnime } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type WatchedAnimeModalProps = {
  anime: WatchedAnime
  onClose: () => void
  onUpdate: () => Promise<void> // triggers a refresh in parent
}

export default function WatchedAnimeModal({
  anime,
  onClose,
  onUpdate,
}: WatchedAnimeModalProps) {
  const [newRating, setNewRating] = useState<string>(anime.rating.toFixed(1))

  const handleUpdateRating = async () => {
    const parsed = parseFloat(newRating)
    if (isNaN(parsed) || parsed < 1 || parsed > 10) {
      alert('Rating must be between 1 and 10.')
      return
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not found')

      await supabase
        .from('anime_entries')
        .update({ rating: parsed })
        .eq('user_id', userData.user.id)
        .eq('anilist_id', anime.id)

      alert('✅ Rating updated!')
      await onUpdate()
      onClose()
    } catch (err) {
      alert('❌ Failed to update rating.')
      console.error(err)
    }
  }

  const handleRemove = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this anime from your watched list?'
    )
    if (!confirmDelete) return

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not found')

      await supabase
        .from('anime_entries')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('anilist_id', anime.id)

      alert('❌ Anime removed from your watched list.')
      await onUpdate()
      onClose()
    } catch (err) {
      alert('Failed to remove anime.')
      console.error(err)
    }
  }

  const description = (anime.description || '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '') // Strip other HTML tags

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
            <p className="text-sm text-gray-300 leading-snug whitespace-pre-wrap max-h-[160px] overflow-y-auto pr-1 mb-4">
              {description}
            </p>

            <div className="mt-4 mb-6">
              <label className="block text-sm font-medium mb-1">Your Rating:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  max={10}
                  inputMode="decimal"
                  value={newRating}
                  onChange={(e) => {
                    const val = e.target.value
                    // Restrict to max 1 decimal place
                    if (/^\d{0,2}(\.\d?)?$/.test(val)) {
                      setNewRating(val)
                    }
                  }}
                  className="w-24 p-2 rounded bg-[#2f2f31] border border-[#2FFFE2] text-white"
                />
                <span className="text-gray-400 text-sm">/ 10</span>
                <button
                  onClick={handleUpdateRating}
                  className="px-4 py-2 bg-[#FF5DA2] text-white rounded hover:opacity-90 transition cursor-pointer"
                >
                  Update Rating
                </button>
              </div>
            </div>

            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
            >
              Remove from Watched List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}