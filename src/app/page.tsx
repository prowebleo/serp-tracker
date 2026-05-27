"use client"

import { useEffect, useState } from "react"
import KpiCard from "@/components/KpiCard"
import RankChart from "@/components/RankChart"

type KeywordData = {
  keyword: string
  currentPosition: number | null
  currentTitle: string | null
  currentUrl: string | null
  currentRating: number | null
  totalResults: number | null
  lastScraped: string
  stats: {
    best: number | null
    change: number | null
    totalSnapshots: number
  }
  positionHistory: { date: string; position: number | null }[]
}

export default function Home() {
  const [data, setData] = useState<KeywordData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/serp")
      .then((r) => r.json())
      .then((d) => setData(d.keywords ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          SERP Rank Tracker
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Automated Google Search position monitoring
        </p>
      </header>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400">
          No keywords tracked yet. Run the scraper first.
        </div>
      ) : (
        data.map((kw) => (
          <div key={kw.keyword} className="mb-10 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    "{kw.keyword}"
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Current position: <strong>#{kw.currentPosition ?? "N/A"}</strong>
                    {" — "}
                    {kw.currentTitle?.slice(0, 80) ?? "No data"}
                  </p>
                  {kw.currentUrl && (
                    <a
                      href={kw.currentUrl}
                      target="_blank"
                      className="mt-0.5 inline-block text-xs text-blue-600 hover:underline"
                    >
                      {kw.currentUrl.slice(0, 80)}
                    </a>
                  )}
                </div>
                {kw.currentRating && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    ⭐ {kw.currentRating}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>Total results: {kw.totalResults?.toLocaleString() ?? "?"}</span>
                <span>Snapshots: {kw.stats.totalSnapshots}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <KpiCard
                label="Best Rank"
                value={kw.stats.best !== null ? `#${kw.stats.best}` : null}
                color="green"
              />
              <KpiCard
                label="Total Change"
                value={
                  kw.stats.change !== null
                    ? kw.stats.change > 0
                      ? `+${kw.stats.change} ▲`
                      : `${kw.stats.change} ▼`
                    : null
                }
                color={
                  kw.stats.change !== null
                    ? kw.stats.change > 0
                      ? "green"
                      : "red"
                    : "default"
                }
                subtitle={
                  kw.stats.change !== null
                    ? kw.stats.change > 0
                      ? "Improved"
                      : "Dropped"
                    : undefined
                }
              />
              <KpiCard
                label="Current Rank"
                value={kw.currentPosition !== null ? `#${kw.currentPosition}` : null}
              />
            </div>

            <RankChart data={kw.positionHistory} keyword={kw.keyword} />
          </div>
        ))
      )}
    </div>
  )
}
