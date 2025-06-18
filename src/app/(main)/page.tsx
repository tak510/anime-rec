import Image from 'next/image'

interface JikanAnime {
  mal_id: number
  title: string
  synopsis: string
  images: { jpg: { image_url: string } }
  genres: { name: string }[]
}

async function fetchTopAnime(): Promise<JikanAnime[]> {
  const res = await fetch('https://api.jikan.moe/v4/top/anime', {
    next: { revalidate: 60 * 60 } // cache for 1 hour
  })
  if (!res.ok) throw new Error('Failed to fetch anime')
  const json = await res.json()
  return json.data
}

export default async function HomePage() {
  let animeList: JikanAnime[] = []

  try {
    animeList = await fetchTopAnime()
  } catch (err) {
    return <div>Error loading anime: {String(err)}</div>
  }

  if (animeList.length === 0) {
    return <div>No anime found.</div>
  }

  return (
    <>
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Recommended for You:</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {animeList.map((anime) => (
          <li key={anime.mal_id} className="border rounded-lg shadow-lg overflow-hidden">
            <Image
              src={anime.images.jpg.image_url}
              alt={anime.title}
              width={400}
              height={225}
              className="w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{anime.title}</h2>
              <p className="text-sm text-gray-600">
                {anime.synopsis?.slice(0, 120)}...
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {anime.genres.slice(0, 3).map((g) => (
                  <span key={g.name} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
    </>
  )
}