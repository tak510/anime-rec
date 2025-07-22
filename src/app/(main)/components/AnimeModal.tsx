'use client'

import React from 'react'
import Image from 'next/image'
import { Anime } from '@/lib/types'

type Props = {
  anime: Anime
  onClose: () => void
}

export default function AnimeModal({ anime, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-[#1D1D1F] text-white max-w-3xl w-full rounded-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-4 p-6">
          <Image
            src={anime.coverImage.large}
            alt={anime.title.userPreferred}
            width={200}
            height={300}
            className="rounded-md object-cover"
          />

          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-[#FF5DA2]">
              {anime.title.userPreferred}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-[12] overflow-y-auto max-h-[300px]">
              {anime.description?.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, '')}
            </p>
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="bg-[#252527] text-[#2FFFE2] text-xs px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}