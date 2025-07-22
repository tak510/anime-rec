import { Anime } from "./types";

export async function fetchPopularAnime(perPage: number, page: number) {
  const query = `
    query PopularAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title { userPreferred }
          coverImage { large }
          averageScore
          genres
          description
        }
      }
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { page, perPage } }),
      next: { revalidate: 86400 },
    });

    const json = await res.json();

    if (json.errors) {
      console.error("AniList API Errors:", json.errors);
      return [];
    }
    return json.data.Page.media as Anime[];
  } catch (error) {
    console.error("Error fetching popular anime:", error);
    return [];
  }
}

export async function fetchTrendingAnime(perPage: number, page: number) {
  const query = `
    query TrendingAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media(type: ANIME, sort: TRENDING_DESC) { # Changed sort to TRENDING_DESC
          id
          title { userPreferred }
          coverImage { large }
          averageScore
          genres
          description
        }
      }
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { page, perPage } }),
      next: { revalidate: 86400 },
    });

    const json = await res.json();

    if (json.errors) {
      console.error("AniList API Errors:", json.errors);
      return [];
    }
    return json.data.Page.media as Anime[];
  } catch (error) {
    console.error("Error fetching trending anime:", error);
    return [];
  }
}

export async function fetchUpcomingAnime(perPage: number, page: number) {
  const query = `
    query UpcomingAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          hasNextPage
        }
        media(type: ANIME, sort: START_DATE_DESC, status: NOT_YET_RELEASED) { # Changed sort and added status
          id
          title { userPreferred }
          coverImage { large }
          averageScore
          genres
          description
        }
      }
    }
  `;

  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { page, perPage } }),
      next: { revalidate: 86400 },
    });

    const json = await res.json();

    if (json.errors) {
      console.error("AniList API Errors:", json.errors);
      return [];
    }
    return json.data.Page.media as Anime[];
  } catch (error) {
    console.error("Error fetching upcoming anime:", error);
    return [];
  }
}

export async function fetchAnimeSearch(search: string) {
  const query = `
    query ($search: String) {
      Page(perPage: 10) {
        media(search: $search, type: ANIME) {
          id
          title {
            userPreferred
          }
          coverImage {
            large
          }
        }
      }
    }
  `

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { search }
    })
  })

  const data = await response.json()
  return data.data.Page.media
}

export async function fetchAnimeByIds(ids: number[]): Promise<Record<number, Anime>> {
  const query = `
    query ($ids: [Int]) {
      Page(perPage: 50) {
        media(id_in: $ids, type: ANIME) {
          id
          title { userPreferred }
          coverImage { large }
          averageScore
          description(asHtml: false)
        }
      }
    }
  `

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { ids } }),
  })

  const json = await response.json()
  const animeList: Anime[] = json.data.Page.media

  const animeMap: Record<number, Anime> = {}
  animeList.forEach((anime) => {
    animeMap[anime.id] = anime
  })

  return animeMap
}