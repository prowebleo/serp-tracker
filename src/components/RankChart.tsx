"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
} from "recharts"

type Props = {
  data: { date: string; position: number | null }[]
  keyword: string
}

export default function RankChart({ data, keyword }: Props) {
  const chartData = data
    .filter((d) => d.position !== null)
    .map((d) => {
      const dt = new Date(d.date)
      return {
        date: dt.toISOString(),
        label: dt.toLocaleDateString("en", { month: "short", day: "numeric" }) +
          " " + dt.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
        position: d.position,
      }
    })

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400">
        Not enough history for chart
      </div>
    )
  }

  const posValues = chartData.map((d) => d.position!).filter((p) => p !== null)
  const minPos = Math.min(...posValues)
  const maxPos = Math.max(...posValues)
  const yMin = Math.max(1, minPos - 2)
  const yMax = maxPos + 2

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Position History</h3>
          <p className="text-xs text-gray-400">&ldquo;{keyword}&rdquo;</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Best #{minPos}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            Worst #{maxPos}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="rankGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[yMin, yMax]}
            reversed
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip
            formatter={(value: any) => [`#${value}`, "Position"]}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              fontSize: "13px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
            }}
          />
          <Area
            type="monotone"
            dataKey="position"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#rankGradient)"
            dot={{ r: 3, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
          />
          <Brush
            dataKey="label"
            height={28}
            stroke="#059669"
            fill="#f0fdf4"
            travellerWidth={10}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
