'use client'

import Image from 'next/image'
import { WatchlistAnime } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type Props = {
  anime: WatchlistAnime
  onClose: () => void
  onUpdate: () => Promise<void>
}

export default function WatchlistAnimeModal({ anime, onClose, onUpdate }: Props) {
  const handleRemove = async () => {
    const confirm = window.confirm(
      'Remove this anime from your watchlist?'
    )
    if (!confirm) return

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user?.id) throw new Error('User not found')

      await supabase
        .from('anime_entries')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('anilist_id', anime.id)

      alert('❌ Removed from watchlist.')
      await onUpdate()
      onClose()
    } catch (err) {
      alert('Failed to remove anime.')
      console.error(err)
    }
  }

  const description = (anime.description || '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')

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
          {/* Cover Image */}
          <div className="relative w-full max-w-[180px] h-[260px] mx-auto md:mx-0">
            <Image
              src={anime.imageUrl}
              alt={anime.title}
              fill
              className="object-cover rounded"
              sizes="180px"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#2FFFE2] font-orbitron mb-2">
              {anime.title}
            </h2>
            <p className="text-sm text-gray-300 leading-snug whitespace-pre-wrap max-h-[160px] overflow-y-auto pr-1 mb-4">
              {description}
            </p>
            <p className="text-sm mb-6">
              AniList Score: <span className="text-[#FF5DA2]">{anime.anilistScore / 10} / 10</span>
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
              >
                Remove from Watchlist
              </button>
              {/* Placeholder for future: Move to Watching */}
              <button
                disabled
                className="px-4 py-2 bg-gray-700 text-white rounded opacity-50 cursor-not-allowed"
              >
                Move to Watching (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}