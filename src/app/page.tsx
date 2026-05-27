"use client"

import { useEffect, useState } from "react"
import { Search, TrendingUp, TrendingDown, BarChart3, Clock, Globe } from "lucide-react"
import StatCard from "@/components/StatCard"
import RankChart from "@/components/RankChart"
import ExportButton from "@/components/ExportButton"

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Search size={32} className="animate-pulse text-emerald-500" />
          <p className="text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Search size={40} className="mx-auto mb-4 text-gray-300" />
        <h1 className="text-xl font-bold text-gray-900">SERP Rank Tracker</h1>
        <p className="mt-2 text-sm text-gray-500">No keywords tracked yet. Run the scraper first.</p>
      </div>
    )
  }

  function positionColor(pos: number | null): "green" | "amber" | "red" {
    if (pos === null) return "amber"
    if (pos <= 3) return "green"
    if (pos <= 10) return "amber"
    return "red"
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Search size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">SERP Tracker</h1>
              <p className="text-sm text-gray-500">Automated Google Search position monitoring</p>
            </div>
          </div>
        </div>
        <ExportButton
          data={data.flatMap((kw) => ({
            Keyword: kw.keyword,
            Position: kw.currentPosition ?? "",
            Title: kw.currentTitle ?? "",
            URL: kw.currentUrl ?? "",
            Rating: kw.currentRating ?? "",
            "Total Results": kw.totalResults ?? "",
            "Best Rank": kw.stats.best ?? "",
            Change: kw.stats.change ?? "",
          }))}
          columns={[
            { key: "Keyword", label: "Keyword" },
            { key: "Position", label: "Position" },
            { key: "Title", label: "Title" },
            { key: "URL", label: "URL" },
            { key: "Rating", label: "Rating" },
            { key: "Total Results", label: "Total Results" },
            { key: "Best Rank", label: "Best Rank" },
            { key: "Change", label: "Change" },
          ]}
          filename="serp-positions"
        />
      </div>

      <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />

      {data.map((kw) => {
        const improved = kw.stats.change !== null && kw.stats.change > 0
        const dropped = kw.stats.change !== null && kw.stats.change < 0
        const posAccent = positionColor(kw.currentPosition)

        return (
          <div key={kw.keyword} className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    &ldquo;{kw.keyword}&rdquo;
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                    {kw.currentTitle ?? "No title data"}
                  </p>
                  {kw.currentUrl && (
                    <a
                      href={kw.currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <Globe size={12} />
                      {kw.currentUrl.slice(0, 70)}
                    </a>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl font-bold text-lg shadow-sm ${
                      posAccent === "green" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      posAccent === "amber" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      #{kw.currentPosition ?? "?"}
                    </div>
                    {improved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <TrendingUp size={14} />
                        +{kw.stats.change}
                      </span>
                    )}
                    {dropped && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                        <TrendingDown size={14} />
                        {kw.stats.change}
                      </span>
                    )}
                    {kw.stats.change === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
                        No change
                      </span>
                    )}
                  </div>
                  {kw.currentRating && (
                    <span className="text-xs text-amber-600 font-medium">
                      ⭐ {kw.currentRating}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Globe size={14} className="text-gray-400" />
                  {kw.totalResults ? `${kw.totalResults.toLocaleString()} results` : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  Last scraped {new Date(kw.lastScraped).toLocaleString("en")}
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-gray-400" />
                  {kw.stats.totalSnapshots} snapshots
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Current Position"
                value={kw.currentPosition !== null ? `#${kw.currentPosition}` : null}
                accent={posAccent}
                trend={improved ? "up" : dropped ? "down" : "neutral"}
                trendLabel={improved ? "Improved" : dropped ? "Dropped" : "Stable"}
              />
              <StatCard
                label="Best Rank"
                value={kw.stats.best !== null ? `#${kw.stats.best}` : null}
                accent="green"
              />
              <StatCard
                label="Position Change"
                value={kw.stats.change !== null ? `${kw.stats.change > 0 ? "+" : ""}${kw.stats.change}` : null}
                accent={improved ? "green" : dropped ? "red" : "amber"}
                trend={improved ? "up" : dropped ? "down" : "neutral"}
                trendLabel={improved ? "Moved up" : dropped ? "Moved down" : "Unchanged"}
              />
            </div>

            <RankChart data={kw.positionHistory} keyword={kw.keyword} />
          </div>
        )
      })}

      <footer className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
        Data refreshed daily
      </footer>
    </div>
  )
}
