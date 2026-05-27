import { getDb } from "./client"
import type { SERPSnapshot } from "@/scraper/types"

type Row = {
  id: number
  keyword: string
  position: number | null
  title: string | null
  url: string | null
  description: string | null
  rating: number | null
  total_results: number | null
  scraped_at: string
}

export async function saveSnapshot(snapshot: SERPSnapshot) {
  const db = await getDb()
  await db.execute({
    sql: `INSERT INTO serp_snapshots (keyword, position, title, url, description, rating, total_results)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      snapshot.keyword,
      snapshot.position,
      snapshot.title,
      snapshot.url,
      snapshot.description,
      snapshot.rating,
      snapshot.total_results,
    ],
  })
}

export async function getHistory(keyword: string): Promise<Row[]> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT * FROM serp_snapshots WHERE keyword = ? ORDER BY scraped_at ASC`,
    args: [keyword],
  })
  return result.rows as unknown as Row[]
}

export async function getLatest(keyword: string): Promise<Row | null> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT * FROM serp_snapshots WHERE keyword = ? ORDER BY scraped_at DESC LIMIT 1`,
    args: [keyword],
  })
  const rows = result.rows as unknown as Row[]
  return rows[0] ?? null
}

export async function getAllKeywords(): Promise<Row[]> {
  const db = await getDb()
  const result = await db.execute(`
    SELECT * FROM serp_snapshots WHERE id IN (
      SELECT MAX(id) FROM serp_snapshots GROUP BY keyword
    ) ORDER BY scraped_at DESC
  `)
  return result.rows as unknown as Row[]
}
