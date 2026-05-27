"use client"

import { useEffect, useState } from "react"
import { Search, BarChart3, Clock, Globe } from "lucide-react"
import RankChart from "@/components/RankChart"
import ExportButton from "@/components/ExportButton"

type SERPResult = {
  position: number | null
  title: string | null
  url: string | null
  rating: number | null
  description: string | null
  snapshots: number
  history: { date: string; position: number | null }[]
}

type KeywordData = {
  keyword: string
  totalResults: number | null
  lastScraped: string
  results: SERPResult[]
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
          data={data.flatMap((kw) =>
            kw.results.map((r) => ({
              Keyword: kw.keyword,
              Position: r.position ?? "",
              Title: r.title ?? "",
              URL: r.url ?? "",
              Rating: r.rating ?? "",
              "Total Results": kw.totalResults ?? "",
              Snapshots: r.snapshots,
            }))
          )}
          columns={[
            { key: "Keyword", label: "Keyword" },
            { key: "Position", label: "Position" },
            { key: "Title", label: "Title" },
            { key: "URL", label: "URL" },
            { key: "Rating", label: "Rating" },
            { key: "Total Results", label: "Total Results" },
            { key: "Snapshots", label: "Snapshots" },
          ]}
          filename="serp-positions"
        />
      </div>

      <div className="mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />

      {data.map((kw) => (
        <div key={kw.keyword} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  &ldquo;{kw.keyword}&rdquo;
                </h2>
                <p className="text-sm text-gray-500">
                  {kw.totalResults?.toLocaleString() ?? "?"} results · Last scraped {new Date(kw.lastScraped).toLocaleString("en")}
                </p>
              </div>
              <span className="text-xs text-gray-400">{kw.results.length} positions</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-12">#</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Title</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">URL</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 w-16">Rating</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 w-20">Snapshots</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kw.results.map((r, i) => (
                    <tr key={r.url ?? i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center justify-center w-8 h-7 rounded-md text-sm font-bold ${
                          (r.position ?? 999) <= 3 ? "bg-emerald-50 text-emerald-700" :
                          (r.position ?? 999) <= 10 ? "bg-amber-50 text-amber-700" :
                          "bg-gray-100 text-gray-500"
                        }`}>
                          #{r.position ?? "?"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-gray-900 line-clamp-1">{r.title ?? "—"}</p>
                        {r.description && (
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{r.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 hidden sm:table-cell">
                        {r.url && (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 hover:underline line-clamp-1">
                            <Globe size={11} className="inline mr-0.5" />
                            {r.url.slice(0, 50)}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-gray-500">
                        {r.rating ? <span className="text-amber-600">⭐ {r.rating}</span> : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <BarChart3 size={12} className="text-gray-400" />
                          {r.snapshots}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <RankChart data={kw.results.flatMap(r => r.history)} keyword={kw.keyword} />
            </div>
          </div>
        </div>
      ))}

      <footer className="mt-12 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
        Data refreshed daily
      </footer>
    </div>
  )
}
