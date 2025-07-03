import { createClient } from '@supabase/supabase-js'
import { WatchedAnime } from './types'
import { fetchAnimeByIds } from './anilist'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function addToWatched(anime: {
  anilistId: number
  rating?: number
}) {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    throw new Error('Not logged in')
  }

  const { error } = await supabase.from('anime_entries').insert([
    {
      user_id: userData.user.id,
      anilist_id: anime.anilistId,
      status: 'completed',
      rating: anime.rating ?? null,
      notes: '',
    },
  ])

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function getWatchedAnime(): Promise<WatchedAnime[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not logged in');

  const { data: entries, error } = await supabase
    .from('anime_entries')
    .select('anilist_id, rating, created_at')
    .eq('user_id', userData.user.id)
    .eq('status', 'completed');

  if (error) throw new Error(error.message);
  if (!entries || entries.length === 0) return [];

  const anilistIds = entries.map(entry => entry.anilist_id);
  const animeMap = await fetchAnimeByIds(anilistIds); // animeMap: Record<number, Anime>

  const enriched: WatchedAnime[] = entries.flatMap(entry => {
    const anime = animeMap[entry.anilist_id];
    if (!anime) return [];

    return [{
      id: anime.id.toString(),
      title: anime.title.userPreferred,
      imageUrl: anime.coverImage.large,
      rating: entry.rating ?? 0,
      watchedAt: entry.created_at ?? '',
      anilistScore: anime.averageScore ?? 0,
      description: anime.description ?? 'No description',
    }];
  });

  return enriched;
}