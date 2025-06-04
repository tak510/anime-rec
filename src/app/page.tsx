import { supabase } from '../lib/supabase'

export default async function HomePage() {
  const { data: animeList, error } = await supabase
    .from('anime')
    .select('*')

  console.log('animeList:', animeList)
  console.log('error:', error)

  if (error) {
    return <div>Error loading anime: {error.message}</div>
  }

  if (!animeList || animeList.length === 0) {
    return <div>No anime found.</div>
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Recommended Anime</h1>
      <ul className="space-y-4">
        {animeList.map((anime) => (
          <li key={anime.id} className="p-4 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold">{anime.title}</h2>
            <p className="text-gray-600">{anime.description}</p>
            {anime.image_url && (
              <img
                src={anime.image_url}
                alt={anime.title}
                className="mt-2 w-48 rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}