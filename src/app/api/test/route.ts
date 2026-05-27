import { scrapeKeyword } from "@/scraper/google"
import { initDb } from "@/db/schema"
import { saveSnapshot, getHistory } from "@/db/queries"

export async function GET() {
  try {
    await initDb()

    const results = await scrapeKeyword("best futures prop firms")
    for (const r of results) {
      await saveSnapshot(r)
    }

    const history = await getHistory("best futures prop firms")

    return Response.json({
      success: true,
      saved: results.length,
      top_result: results[0],
      total_snapshots: history.length,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
