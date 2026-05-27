import { getDb } from "./client"

export async function initDb() {
  const db = await getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS serp_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL,
      position INTEGER,
      title TEXT,
      url TEXT,
      description TEXT,
      rating REAL,
      total_results INTEGER,
      scraped_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_serp_keyword ON serp_snapshots(keyword)`
  )
}
