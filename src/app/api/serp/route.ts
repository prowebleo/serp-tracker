import { initDb } from "@/db/schema"
import { getAllKeywords, getHistory } from "@/db/queries"

export async function GET() {
  await initDb()

  const rows = await getAllKeywords()

  const grouped = new Map<string, {
    keyword: string
    totalResults: number | null
    lastScraped: string
    results: { position: number | null; title: string | null; url: string | null; rating: number | null; description: string | null; snapshots: number; history: { date: string; position: number | null }[] }[]
  }>()

  for (const r of rows) {
    const history = await getHistory(r.keyword, r.url ?? undefined)
    const key = r.keyword

    if (!grouped.has(key)) {
      grouped.set(key, {
        keyword: key,
        totalResults: r.total_results,
        lastScraped: r.scraped_at,
        results: [],
      })
    }

    const entry = grouped.get(key)!
    if (new Date(r.scraped_at) > new Date(entry.lastScraped)) {
      entry.lastScraped = r.scraped_at
    }

    entry.results.push({
      position: r.position,
      title: r.title,
      url: r.url,
      rating: r.rating,
      description: r.description,
      snapshots: history.length,
      history: history.map((h) => ({ date: h.scraped_at, position: h.position })),
    })
  }

  const keywords = Array.from(grouped.values()).map((g) => ({
    ...g,
    results: g.results.sort((a, b) => (a.position ?? 999) - (b.position ?? 999)),
  }))

  return Response.json({ keywords })
}
