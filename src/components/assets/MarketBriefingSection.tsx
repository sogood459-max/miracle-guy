import { useMemo, useState } from 'react'
import { MARKETS } from '../../types'
import type { Market, MarketBriefing } from '../../types'

interface MarketBriefingSectionProps {
  items: MarketBriefing[]
  onAdd: () => void
  onEdit: (item: MarketBriefing) => void
  onDelete: (id: string) => void
}

const marketBadge: Record<Market, string> = {
  미국: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  한국: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  일본: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function MarketBriefingSection({ items, onAdd, onEdit, onDelete }: MarketBriefingSectionProps) {
  const [marketFilter, setMarketFilter] = useState<Market | ''>('')

  const filtered = useMemo(() => {
    return items
      .filter((i) => !marketFilter || i.market === marketFilter)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  }, [items, marketFilter])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">시장 브리핑</h3>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setMarketFilter('')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                marketFilter === ''
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              전체
            </button>
            {MARKETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMarketFilter(m)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  marketFilter === m
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 sm:self-auto"
        >
          + 브리핑 추가
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          아직 기록된 브리핑이 없습니다. 매일 자동으로 오는 시황 알림 내용을 여기에 기록해보세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="group rounded-lg border border-slate-100 p-3 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${marketBadge[item.market]}`}>
                    {item.market}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(item.date)}</span>
                </div>
                <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    aria-label="수정"
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    aria-label="삭제"
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
