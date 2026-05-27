import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { scrapeKeyword } from "./google"
import { initDb } from "../db/schema"
import { saveSnapshot } from "../db/queries"

function getKeywords(): string[] {
  const raw = process.env.SERP_KEYWORDS ?? ""
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

async function main() {
  await initDb()

  const keywords = getKeywords()

  if (keywords.length === 0) {
    console.error("No keywords configured. Set SERP_KEYWORDS in .env.local")
    console.error('Example: SERP_KEYWORDS="best futures prop firms,top trading firms"')
    process.exit(1)
  }

  console.log(`Tracking ${keywords.length} keyword(s)...\n`)

  for (const kw of keywords) {
    try {
      console.log(`Scraping "${kw}"...`)
      const results = await scrapeKeyword(kw)
      for (const r of results) {
        await saveSnapshot(r)
      }
      const top = results[0]
      console.log(`  ✓ #${top.position ?? "?"} — ${top.title?.slice(0, 60)}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      console.error(`  ✗ "${kw}": ${msg}`)
    }
  }

  console.log("\nDone.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
