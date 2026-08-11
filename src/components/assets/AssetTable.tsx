import type { AssetItem } from '../../types'
import { formatKRW } from '../../lib/utils'

interface AssetTableProps {
  items: AssetItem[]
  onEdit: (item: AssetItem) => void
  onDelete: (id: string) => void
}

export function AssetTable({ items, onEdit, onDelete }: AssetTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs text-slate-400 dark:border-slate-800">
            <th className="px-4 py-3 font-medium">구분</th>
            <th className="px-4 py-3 font-medium">이름</th>
            <th className="px-4 py-3 font-medium">카테고리</th>
            <th className="px-4 py-3 font-medium">기관</th>
            <th className="px-4 py-3 text-right font-medium">금액</th>
            <th className="px-4 py-3 font-medium">메모</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                등록된 항목이 없습니다.
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id} className="group border-b border-slate-50 last:border-0 dark:border-slate-800/60">
              <td className="px-4 py-3">
                <span
                  className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.kind === 'asset'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  }`}
                >
                  {item.kind === 'asset' ? '자산' : '부채'}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.category}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.institution || '-'}</td>
              <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">
                {formatKRW(item.amount)}
              </td>
              <td className="max-w-[160px] truncate px-4 py-3 text-slate-400">{item.memo || '-'}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1 opacity-0 transition group-hover:opacity-100">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
