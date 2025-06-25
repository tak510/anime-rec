export async function fetchPopularAnime(page = 1, perPage = 20) {
  const query = `
    query PopularAnime($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title { userPreferred }
          coverImage { large }
          averageScore
          genres
        }
      }
    }
  `
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ query, variables: { page, perPage } }),
    next: { revalidate: 86400 },
  })
  const json = await res.json()
  return json.data.Page.media as Array<{
    id: number;
    title: { userPreferred: string };
    coverImage: { large: string };
    averageScore: number;
    genres: string[];
  }>
}