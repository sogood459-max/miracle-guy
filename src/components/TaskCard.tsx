import type { Status, Task } from '../types'
import { STATUSES } from '../types'
import { formatDate, isOverdue, priorityStyles } from '../lib/utils'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status)

  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label="수정"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label="삭제"
            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
          >
            ✕
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
      )}

      <p className="mt-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">{task.project}</p>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className={`font-medium ${priorityStyles[task.priority]}`}>{task.priority}</span>
        <span className={overdue ? 'font-semibold text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}>
          {overdue ? '지연 · ' : ''}
          {formatDate(task.dueDate)}
        </span>
      </div>

      <div className="mt-2.5">
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>진척률</span>
          <span>{task.progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {task.assignee.slice(0, 1)}
        </span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-1 text-[11px] text-slate-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
