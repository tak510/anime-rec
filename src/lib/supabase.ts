// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { WatchedAnime, WatchingAnime, WatchlistAnime} from './types';
import { fetchAnimeByIds } from './anilist';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AnimeEntryStatus = 'completed' | 'watching' | 'plan';

/**
 * Adds or updates an anime entry for a user in the 'anime_entries' table.
 * Uses upsert (update or insert) to handle cases where an entry might already exist (e.g., changing status).
 *
 * @param anilistId
 * @param status
 * @param rating
 * @param notes
 */

export async function addOrUpdateAnimeEntry(
  anilistId: number,
  status: AnimeEntryStatus,
  rating: number | null = null,
  notes: string | null = null
) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error('Not logged in. Please log in to add anime to your lists.');
  }

  const entryData = {
    user_id: userData.user.id,
    anilist_id: anilistId,
    status: status,
    rating: rating,
    notes: notes,
  };

  const { data: existingEntry, error: fetchError } = await supabase
    .from('anime_entries')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('anilist_id', anilistId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means 'no rows found', which is expected for new entries
    throw new Error(`Error checking existing entry: ${fetchError.message}`);
  }

  let upsertResult;

  if (existingEntry) {
    upsertResult = await supabase
      .from('anime_entries')
      .update(entryData)
      .eq('id', existingEntry.id);
  } else {
    upsertResult = await supabase
      .from('anime_entries')
      .insert([entryData]);
  }

  if (upsertResult.error) {
    throw new Error(`Failed to add/update anime entry: ${upsertResult.error.message}`);
  }

  return true;
}

/**
 * Removes an anime entry from a user's list.
 *
 * @param anilistId The AniList ID of the anime to remove.
 */
export async function removeAnimeEntry(anilistId: number) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error('Not logged in. Please log in to remove anime from your lists.');
  }

  const { error } = await supabase
    .from('anime_entries')
    .delete()
    .eq('user_id', userData.user.id)
    .eq('anilist_id', anilistId);

  if (error) {
    throw new Error(`Failed to remove anime entry: ${error.message}`);
  }

  return true;
}

/**
 * Gets the current status of a specific anime for the logged-in user.
 * Returns the status string ('completed', 'watching', 'plan') or null if not found.
 *
 * @param anilistId
 */
export async function getUserAnimeEntryStatus(anilistId: number): Promise<AnimeEntryStatus | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from('anime_entries')
    .select('status')
    .eq('user_id', userData.user.id)
    .eq('anilist_id', anilistId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching anime entry status:", error.message);
    return null;
  }

  return data ? (data.status as AnimeEntryStatus) : null;
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
  const animeMap = await fetchAnimeByIds(anilistIds);

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

export async function getWatchlistAnime(): Promise<WatchlistAnime[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not logged in');

  const { data: entries, error } = await supabase
    .from('anime_entries')
    .select('anilist_id, created_at')
    .eq('user_id', userData.user.id)
    .eq('status', 'plan');

  if (error) throw new Error(error.message);
  if (!entries || entries.length === 0) return [];

  const anilistIds = entries.map(entry => entry.anilist_id);
  const animeMap = await fetchAnimeByIds(anilistIds);

  const enriched: WatchlistAnime[] = entries.flatMap(entry => {
    const anime = animeMap[entry.anilist_id];
    if (!anime) return [];

    return [{
      id: anime.id.toString(),
      title: anime.title.userPreferred,
      imageUrl: anime.coverImage.large,
      addedAt: entry.created_at ?? '',
      anilistScore: anime.averageScore ?? 0,
      description: anime.description ?? 'No description',
    }];
  });

  return enriched;
}

export async function getWatchingAnime(): Promise<WatchingAnime[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error('Not logged in');

  const { data: entries, error } = await supabase
    .from('anime_entries')
    .select('anilist_id, created_at, rating')
    .eq('user_id', userData.user.id)
    .eq('status', 'watching');

  if (error) throw new Error(error.message);
  if (!entries || entries.length === 0) return [];

  const anilistIds = entries.map(entry => entry.anilist_id);
  const animeMap = await fetchAnimeByIds(anilistIds);

  const enriched: WatchingAnime[] = entries.flatMap(entry => {
    const anime = animeMap[entry.anilist_id];
    if (!anime) return [];

    return [{
      id: anime.id.toString(),
      title: anime.title.userPreferred,
      imageUrl: anime.coverImage.large,
      startedWatching: entry.created_at ?? '',
      rating: entry.rating ?? 0,
      anilistScore: anime.averageScore ?? 0,
      description: anime.description ?? 'No description',
    }];
  });

  return enriched;
}

/* Might need these */

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

export async function addToWatchlist(anime: {
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
      status: 'plan',
      rating: anime.rating ?? null,
      notes: '',
    },
  ])

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export async function addToWatching(anime: {
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
      status: 'watching',
      rating: anime.rating ?? null,
      notes: '',
    },
  ])

  if (error) {
    throw new Error(error.message)
  }

  return true
}
