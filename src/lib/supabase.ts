import { createClient } from '@supabase/supabase-js'

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

export async function fetchWatchedAnimeEntries() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not logged in');

  const { data, error } = await supabase
    .from('anime_entries')
    .select('anilist_id, rating')
    .eq('user_id', userData.user.id)
    .eq('status', 'completed');

  if (error) throw new Error(error.message);

  return data ?? [];
}
