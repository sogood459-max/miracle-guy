import type { Priority, Status } from '../types'

export function isOverdue(dueDate: string, status: Status) {
  if (status === '완료') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

export const statusStyles: Record<Status, { badge: string; dot: string }> = {
  예정: { badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300', dot: 'bg-slate-400' },
  진행중: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', dot: 'bg-blue-500' },
  완료: { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500' },
  보류: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', dot: 'bg-amber-500' },
}

export const priorityStyles: Record<Priority, string> = {
  낮음: 'text-slate-500 dark:text-slate-400',
  보통: 'text-blue-600 dark:text-blue-400',
  높음: 'text-orange-600 dark:text-orange-400',
  긴급: 'text-red-600 dark:text-red-400',
}

const krwFormatter = new Intl.NumberFormat('ko-KR')

export function formatKRW(amount: number) {
  return `${krwFormatter.format(amount)}원`
}

const CATEGORY_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-slate-500',
]

export function colorForIndex(index: number) {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}
