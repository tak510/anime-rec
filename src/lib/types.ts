export type Anime = {
  id: number;
  title: { userPreferred: string };
  coverImage: { large: string };
  averageScore: number;
  genres: string[];
  description?: string;
};

export type WatchedAnime = {
  id: string
  title: string
  imageUrl: string
  rating: number
  watchedAt: string
  anilistScore: number
  description: string
}

export type WatchlistAnime = {
  id: string
  title: string
  imageUrl: string
  addedAt: string
  anilistScore: number
  description: string
}