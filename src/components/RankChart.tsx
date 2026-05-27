"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
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
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
      }),
      position: d.position,
    }))

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400">
        Not enough history for chart
      </div>
    )
  }

  const minPos = Math.min(...chartData.map((d) => d.position))
  const maxPos = Math.max(...chartData.map((d) => d.position))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Position History — "{keyword}"
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis
            domain={[Math.max(1, minPos - 1), maxPos + 1]}
            reversed
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            label={{ value: "Rank", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
          />
          <Tooltip
            formatter={(value: any) => [`#${value}`, "Position"]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
          />
          <Line
            type="monotone"
            dataKey="position"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3, fill: "#2563eb" }}
            activeDot={{ r: 5 }}
          />
          <Brush
            dataKey="date"
            height={30}
            stroke="#2563eb"
            fill="#f0f5ff"
            travellerWidth={10}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
