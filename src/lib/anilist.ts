import { Anime } from "./types";

export async function fetchPopularAnime(numResults: number = 100) {
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

  const animes: Anime[] = [];
  let page = 1;
  const perPageLimit = 50; // AniList API perPage limit

  while (animes.length < numResults) {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { page, perPage: perPageLimit } }),
      next: { revalidate: 86400 },
    });

    const json = await res.json();

    if (json.errors) {
      console.error("AniList API Errors:", json.errors);
      break;
    }

    const currentPageMedia = json.data.Page.media as Anime[];
    animes.push(...currentPageMedia);

    if (!json.data.Page.pageInfo.hasNextPage || animes.length >= numResults) {
      break;
    }
    page++;
  }

  return animes.slice(0, numResults);
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