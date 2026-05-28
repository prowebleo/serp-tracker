import { Download } from "lucide-react"

type Column = { key: string; label: string }

type Props = {
  data: Record<string, any>[]
  columns: Column[]
  filename: string
}

function escape(v: any): string {
  const s = String(v ?? "")
  return `"${s.replace(/"/g, '""')}"`
}

export default function ExportButton({ data, columns, filename }: Props) {
  function handleExport() {
    const header = columns.map((c) => escape(c.label)).join(",")
    const rows = data.map((row) =>
      columns.map((c) => escape(row[c.key])).join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800 shadow-sm"
    >
      <Download size={14} />
      CSV
    </button>
  )
}
