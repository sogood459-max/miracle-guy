import type { Status, Task } from '../types'
import { TaskCard } from './TaskCard'
import { statusStyles } from '../lib/utils'

const COLUMNS: Status[] = ['예정', '진행중', '보류', '완료']

interface KanbanBoardProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
}

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column)
        return (
          <div key={column} className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/50">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${statusStyles[column].dot}`} />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{column}</h3>
              </div>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">
                {columnTasks.length}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              {columnTasks.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-700">
                  업무 없음
                </p>
              )}
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
