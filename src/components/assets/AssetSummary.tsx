import type { AssetItem } from '../../types'
import { formatKRW } from '../../lib/utils'

interface AssetSummaryProps {
  items: AssetItem[]
}

export function AssetSummary({ items }: AssetSummaryProps) {
  const totalAssets = items.filter((i) => i.kind === 'asset').reduce((sum, i) => sum + i.amount, 0)
  const totalLiabilities = items.filter((i) => i.kind === 'liability').reduce((sum, i) => sum + i.amount, 0)
  const netWorth = totalAssets - totalLiabilities

  const cards = [
    { label: '총자산', value: totalAssets, tone: 'text-slate-900 dark:text-slate-100' },
    { label: '총부채', value: totalLiabilities, tone: 'text-red-600 dark:text-red-400' },
    {
      label: '순자산',
      value: netWorth,
      tone: netWorth >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${card.tone}`}>{formatKRW(card.value)}</p>
        </div>
      ))}
    </div>
  )
}
