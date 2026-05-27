import { initDb } from "@/db/schema"
import { getAllKeywords, getHistory } from "@/db/queries"

export async function GET() {
  await initDb()

  const rows = await getAllKeywords()
  const result = []

  for (const r of rows) {
    const history = await getHistory(r.keyword)
    const positions = history.map((h) => ({
      date: h.scraped_at,
      position: h.position,
    }))

    const numericPositions = positions
      .map((p) => p.position)
      .filter((p): p is number => p !== null)

    const best = numericPositions.length ? Math.min(...numericPositions) : null
    const latest = numericPositions[numericPositions.length - 1] ?? null
    const first = numericPositions[0] ?? null
    const change =
      latest !== null && first !== null
        ? first - latest
        : null

    result.push({
      keyword: r.keyword,
      currentPosition: r.position,
      currentTitle: r.title,
      currentUrl: r.url,
      currentRating: r.rating,
      totalResults: r.total_results,
      lastScraped: r.scraped_at,
      stats: { best, change, totalSnapshots: history.length },
      positionHistory: positions,
    })
  }

  return Response.json({ keywords: result })
}
