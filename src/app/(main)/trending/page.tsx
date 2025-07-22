'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { fetchTrendingAnime } from '@/lib/anilist'
import { Anime } from '@/lib/types'
import AnimeModal from '../components/AnimeModal'

const ANIME_LOAD_LIMIT = 50
const MAX_ANIME_DISPLAY = 200

export default function TrendingPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadAnime = useCallback(async (page: number) => {
    setIsLoadingMore(true)
    try {
      const newAnime = await fetchTrendingAnime(ANIME_LOAD_LIMIT, page)

      setAnimeList((prevAnimeList) => {
        const existingAnimeIds = new Set(prevAnimeList.map(anime => anime.id));
        const filteredNewAnime = newAnime.filter(anime => !existingAnimeIds.has(anime.id));

        const combinedList = [...prevAnimeList, ...filteredNewAnime];

        if (newAnime.length === 0 || combinedList.length >= MAX_ANIME_DISPLAY) {
          setHasMore(false);
        }
        return combinedList;
      });

    } catch (error) {
      console.error("Failed to fetch more anime:", error)
      setHasMore(false)
    } finally {
      setIsLoadingMore(false)
    }
  }, []);

  useEffect(() => {
    loadAnime(1)
  }, [loadAnime])

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && animeList.length < MAX_ANIME_DISPLAY) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      loadAnime(nextPage)
    }
  }

  if (animeList.length === 0 && isLoadingMore && currentPage === 1) {
    return (
      <p className="pt-20 text-center text-gray-400">
        Loading trending anime...
      </p>
    )
  }

  return (
    <main className="bg-[#1D1D1F] text-[#F5EDF7] min-h-screen px-4 md:px-12 py-10 font-inter">
      <h1 className="text-4xl font-orbitron text-center mb-10 text-[#FF5DA2]">
        Trending Anime
      </h1>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-[#2FFFE2]">
          Current Most Trending Anime
        </h2>
        <div className="flex overflow-x-auto space-x-6 pl-4 pb-4 pt-4">
          {animeList.slice(0, 10).map((anime, idx) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="cursor-pointer flex flex-col min-w-[200px] bg-[#2f2f31] border border-[#FF5DA2] hover:scale-105 transition"
            >
              <Image
                src={anime.coverImage.large}
                alt={anime.title.userPreferred}
                width={200}
                height={300}
                className="object-cover"
              />
              <div className="flex flex-col flex-grow p-3">
                <p className="text-lg font-semibold text-[#FF5DA2]">
                  {idx + 1}. {anime.title.userPreferred}
                </p>
                <p className="text-sm text-[#2FFFE2]">
                  ⭐ {anime.averageScore / 10}
                </p>
                <div className="mt-auto flex flex-wrap gap-1">
                  {anime.genres.slice(0, 3).map((genre, genreIdx) => (
                    <span
                      key={genreIdx}
                      className="bg-[#252527] text-[#2FFFE2] text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-[#2FFFE2]">
          Currently Trending Anime
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animeList.map((anime) => (
            <div
              key={anime.id}
              onClick={() => setSelectedAnime(anime)}
              className="cursor-pointer flex flex-col bg-[#2f2f31] rounded-lg overflow-hidden border border-[#6B4CA0] hover:scale-105 transition"
            >
              <Image
                src={anime.coverImage.large}
                alt={anime.title.userPreferred}
                width={300}
                height={400}
                className="object-cover"
              />
              <div className="flex flex-col flex-grow p-3">
                <h3 className="text-sm font-semibold">
                  {anime.title.userPreferred}
                </h3>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {anime.genres.slice(0, 3).map((genre, genreIdx) => (
                    <span
                      key={genreIdx}
                      className="bg-[#252527] text-[#2FFFE2] text-[10px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && animeList.length < MAX_ANIME_DISPLAY && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-[#FF5DA2] text-white px-8 py-3 rounded-full cursor-pointer text-lg font-semibold hover:bg-[#E04B90] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </section>

      {selectedAnime && (
        <AnimeModal
          anime={selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </main>
  )
}