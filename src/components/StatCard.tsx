import { TrendingUp, TrendingDown, Minus } from "lucide-react"

type Props = {
  label: string
  value: string | number | null
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  accent?: "blue" | "green" | "red" | "amber" | "purple"
}

const accentStyles: Record<string, string> = {
  blue: "border-l-blue-500 bg-blue-50/50",
  green: "border-l-emerald-500 bg-emerald-50/50",
  red: "border-l-red-500 bg-red-50/50",
  amber: "border-l-amber-500 bg-amber-50/50",
  purple: "border-l-violet-500 bg-violet-50/50",
}

const valueStyles: Record<string, string> = {
  blue: "text-blue-700",
  green: "text-emerald-700",
  red: "text-red-600",
  amber: "text-amber-700",
  purple: "text-violet-700",
}

export default function StatCard({ label, value, trend, trendLabel, accent = "blue" }: Props) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-500" : "text-gray-400"

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md ${accentStyles[accent]} border-l-4`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold tracking-tight ${valueStyles[accent]}`}>
        {value ?? "—"}
      </p>
      {trend && (
        <p className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon size={14} />
          {trendLabel ?? trend}
        </p>
      )}
    </div>
  )
}
