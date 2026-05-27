import type { SERPSnapshot, GoogleResponse, GoogleDirectResult } from "./types"

function getApiUrl(): string {
  return process.env.SCRAPER_API_URL ?? ""
}

function getAuth(): string {
  const token = process.env.SCRAPER_API_TOKEN
  if (!token) throw new Error("Falta SCRAPER_API_TOKEN")
  return `Basic ${token}`
}

function unwrap(data: GoogleResponse): GoogleDirectResult {
  if (Array.isArray(data.results)) {
    const inner = data.results[0]?.content?.results ?? {}
    return (inner as any)?.results ?? inner
  }
  return (data.results as GoogleDirectResult) ?? {}
}

export async function scrapeKeyword(keyword: string): Promise<SERPSnapshot[]> {
  const response = await fetch(getApiUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuth(),
    },
    body: JSON.stringify({
      target: "google_search",
      query: keyword,
      headless: "html",
      parse: true,
      page_count: 1,
    }),
  })

  if (!response.ok) {
    throw new Error(`Scraper error ${response.status}: ${await response.text()}`)
  }

  const data: GoogleResponse = await response.json()
  const results = unwrap(data)
  const organic = results.organic ?? []
  const total = results.search_information?.total_results ?? null

  if (organic.length === 0) {
    return [{
      keyword,
      position: null,
      title: null,
      url: null,
      description: null,
      rating: null,
      total_results: total,
      scraped_at: new Date().toISOString(),
    }]
  }

  return organic.map((r) => ({
    keyword,
    position: r.pos ?? null,
    title: r.title ?? null,
    url: r.url ?? null,
    description: r.desc ?? null,
    rating: r.rating ?? null,
    total_results: total,
    scraped_at: new Date().toISOString(),
  }))
}
