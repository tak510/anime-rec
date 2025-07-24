'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { fetchSeasonalAnime } from '@/lib/anilist'
import { Anime } from '@/lib/types'
import AnimeModal from '../components/AnimeModal'

const ANIME_LOAD_LIMIT = 50
const MAX_ANIME_DISPLAY = 200

function getCurrentSeasonAndYear() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  let season = 'WINTER';
  if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else if (month >= 9 && month <= 11) season = 'FALL';

  return { season, year };
}

const ALL_SEASONS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

export default function SeasonalPage() {
  const { season: initialSeason, year: initialYear } = useMemo(getCurrentSeasonAndYear, []);

  const [animeList, setAnimeList] = useState<Anime[]>([])
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentYear, setCurrentYear] = useState(initialYear);

  const [stagedSeason, setStagedSeason] = useState(initialSeason);
  const [stagedYear, setStagedYear] = useState(initialYear);

  const years = useMemo(() => {
    const arr = [];
    const current = new Date().getFullYear();
    for (let i = current + 2; i >= current - 5; i--) {
      arr.push(i);
    }
    return arr;
  }, []);

  const loadAnime = useCallback(async (page: number, season: string, year: number, reset: boolean = false) => {
    setIsLoadingMore(true)
    try {
      const newAnime = await fetchSeasonalAnime(ANIME_LOAD_LIMIT, page, season, year)

      setAnimeList((prevAnimeList) => {
        const listToUpdate = reset ? [] : prevAnimeList;
        const existingAnimeIds = new Set(listToUpdate.map(anime => anime.id));
        const filteredNewAnime = newAnime.filter(anime => !existingAnimeIds.has(anime.id));

        const combinedList = [...listToUpdate, ...filteredNewAnime];

        if (newAnime.length === 0 || combinedList.length >= MAX_ANIME_DISPLAY) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        return combinedList;
      });

    } catch (error) {
      console.error("Failed to fetch seasonal anime:", error)
      setHasMore(false)
    } finally {
      setIsLoadingMore(false)
    }
  }, []);

  // Effect to load initial anime for the current season/year on component mount
  useEffect(() => {
    loadAnime(1, currentSeason, currentYear, true);
  }, [currentSeason, currentYear, loadAnime]);


  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && animeList.length < MAX_ANIME_DISPLAY) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      loadAnime(nextPage, currentSeason, currentYear);
    }
  }

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStagedSeason(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStagedYear(Number(event.target.value));
  };

  const handleSearchClick = () => {
    if (stagedSeason !== currentSeason || stagedYear !== currentYear) {
      setCurrentSeason(stagedSeason);
      setCurrentYear(stagedYear);
      setCurrentPage(1);
      setAnimeList([]);
      setHasMore(true);
    }
  };

  if (animeList.length === 0 && isLoadingMore && currentPage === 1) {
    return (
      <p className="pt-20 text-center text-gray-400">
        Loading {currentSeason} {currentYear} anime...
      </p>
    )
  }

  return (
    <main className="bg-[#1D1D1F] text-[#F5EDF7] min-h-screen px-4 md:px-12 py-10 font-inter">
      <h1 className="text-4xl font-orbitron text-center mb-10 text-[#FF5DA2]">
        Seasonal Anime
      </h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
        <label htmlFor="season-select" className="sr-only">Select Season</label>
        <select
          id="season-select"
          value={stagedSeason}
          onChange={handleSeasonChange}
          className="bg-[#2f2f31] text-[#2FFFE2] border border-[#FF5DA2] rounded-md px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#FF5DA2]"
        >
          {ALL_SEASONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label htmlFor="year-select" className="sr-only">Select Year</label>
        <select
          id="year-select"
          value={stagedYear}
          onChange={handleYearChange}
          className="bg-[#2f2f31] text-[#2FFFE2] border border-[#FF5DA2] rounded-md px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#FF5DA2]"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={handleSearchClick}
          disabled={isLoadingMore}
          className="bg-[#2FFFE2] text-[#1D1D1F] px-6 py-2 cursor-pointer rounded-md font-semibold text-lg hover:bg-[#1D1D1F] hover:text-[#2FFFE2] border border-[#2FFFE2] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingMore ? 'Searching...' : 'Search Season'}
        </button>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-[#2FFFE2]">
          Top 10 from {currentSeason} {currentYear}
        </h2>
        {animeList.length > 0 ? (
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
                    ⭐ {anime.averageScore ? anime.averageScore / 10 : 'N/A'}
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
        ) : (
          !isLoadingMore && <p className="text-center text-gray-400">No anime found for {currentSeason} {currentYear} yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-[#2FFFE2]">
          All Anime from {currentSeason} {currentYear}
        </h2>
        {animeList.length > 0 ? (
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
        ) : (
          !isLoadingMore && <p className="text-center text-gray-400">No anime to display for this selection.</p>
        )}

        {hasMore && animeList.length < MAX_ANIME_DISPLAY && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="bg-[#FF5DA2] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#E04B90] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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