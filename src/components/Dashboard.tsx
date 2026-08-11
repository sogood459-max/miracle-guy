import type { Task } from '../types'
import { isOverdue } from '../lib/utils'

interface DashboardProps {
  tasks: Task[]
}

export function Dashboard({ tasks }: DashboardProps) {
  const total = tasks.length
  const done = tasks.filter((t) => t.status === '완료').length
  const inProgress = tasks.filter((t) => t.status === '진행중').length
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length
  const avgProgress = total === 0 ? 0 : Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / total)

  const cards = [
    { label: '전체 업무', value: total, unit: '건', tone: 'text-slate-900 dark:text-slate-100' },
    { label: '진행중', value: inProgress, unit: '건', tone: 'text-blue-600 dark:text-blue-400' },
    { label: '완료율', value: total === 0 ? 0 : Math.round((done / total) * 100), unit: '%', tone: 'text-emerald-600 dark:text-emerald-400' },
    { label: '지연', value: overdue, unit: '건', tone: 'text-red-600 dark:text-red-400' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
          <p className={`mt-1 text-2xl font-semibold ${card.tone}`}>
            {card.value}
            <span className="ml-1 text-base font-normal text-slate-400">{card.unit}</span>
          </p>
        </div>
      ))}
      <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">전체 평균 진척률</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">{avgProgress}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
