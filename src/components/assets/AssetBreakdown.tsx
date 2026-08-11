import type { AssetItem } from '../../types'
import { colorForIndex, formatKRW } from '../../lib/utils'

interface AssetBreakdownProps {
  items: AssetItem[]
}

export function AssetBreakdown({ items }: AssetBreakdownProps) {
  const assets = items.filter((i) => i.kind === 'asset')
  const total = assets.reduce((sum, i) => sum + i.amount, 0)

  const byCategory = new Map<string, number>()
  for (const item of assets) {
    byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + item.amount)
  }
  const rows = Array.from(byCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount], index) => ({
      category,
      amount,
      pct: total === 0 ? 0 : Math.round((amount / total) * 100),
      color: colorForIndex(index),
    }))

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">자산 구성</h3>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">등록된 자산이 없습니다.</p>
      ) : (
        <>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {rows.map((row) => (
              <div key={row.category} className={row.color} style={{ width: `${row.pct}%` }} />
            ))}
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {rows.map((row) => (
              <li key={row.category} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                  {row.category}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-slate-400">{row.pct}%</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{formatKRW(row.amount)}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
