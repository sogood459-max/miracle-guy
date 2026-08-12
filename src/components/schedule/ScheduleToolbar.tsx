import { SCHEDULE_TYPES } from '../../types'
import type { Member } from '../../types'
import { formatWeekRange } from '../../lib/schedule'

export interface ScheduleFilters {
  search: string
  memberId: string
  type: string
}

interface ScheduleToolbarProps {
  weekStart: string
  filters: ScheduleFilters
  members: Member[]
  onFiltersChange: (filters: ScheduleFilters) => void
  onWeekShift: (weeks: number) => void
  onToday: () => void
  onManageMembers: () => void
  onAddEvent: () => void
}

const controlClass =
  'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

export function ScheduleToolbar({
  weekStart,
  filters,
  members,
  onFiltersChange,
  onWeekShift,
  onToday,
  onManageMembers,
  onAddEvent,
}: ScheduleToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onWeekShift(-1)}
            aria-label="이전 주"
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            오늘
          </button>
          <button
            type="button"
            onClick={() => onWeekShift(1)}
            aria-label="다음 주"
            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            ›
          </button>
          <h2 className="ml-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {formatWeekRange(weekStart)}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onManageMembers}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            부서원 관리
          </button>
          <button
            type="button"
            onClick={onAddEvent}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            + 새 일정
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder="일정 검색..."
          className={`${controlClass} w-full placeholder:text-slate-400 sm:w-56`}
        />
        <select
          value={filters.memberId}
          onChange={(e) => onFiltersChange({ ...filters, memberId: e.target.value })}
          className={controlClass}
        >
          <option value="">전체 부서원</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select
          value={filters.type}
          onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
          className={controlClass}
        >
          <option value="">전체 유형</option>
          {SCHEDULE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
