import { useState } from 'react'
import type { FormEvent } from 'react'
import { PRIORITIES, STATUSES } from '../types'
import type { Task, TaskDraft } from '../types'
import { Modal } from './Modal'

interface TaskFormModalProps {
  task: Task | null
  onSave: (draft: TaskDraft) => void
  onClose: () => void
}

const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  assignee: '',
  project: '',
  status: '예정',
  priority: '보통',
  progress: 0,
  dueDate: new Date().toISOString().slice(0, 10),
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
const labelClass = 'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function TaskFormModal({ task, onSave, onClose }: TaskFormModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(
    task
      ? {
          title: task.title,
          description: task.description,
          assignee: task.assignee,
          project: task.project,
          status: task.status,
          priority: task.priority,
          progress: task.progress,
          dueDate: task.dueDate,
        }
      : emptyDraft,
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    onSave(draft)
  }

  return (
    <Modal title={task ? '업무 수정' : '새 업무'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>제목</label>
          <input
            required
            className={inputClass}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="업무 제목"
          />
        </div>
        <div>
          <label className={labelClass}>설명</label>
          <textarea
            className={inputClass}
            rows={2}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="업무 설명 (선택)"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>담당자</label>
            <input
              className={inputClass}
              value={draft.assignee}
              onChange={(e) => setDraft({ ...draft, assignee: e.target.value })}
              placeholder="담당자 이름"
            />
          </div>
          <div>
            <label className={labelClass}>프로젝트</label>
            <input
              className={inputClass}
              value={draft.project}
              onChange={(e) => setDraft({ ...draft, project: e.target.value })}
              placeholder="프로젝트명"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>상태</label>
            <select
              className={inputClass}
              value={draft.status}
              onChange={(e) => setDraft({ ...draft, status: e.target.value as Task['status'] })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>우선순위</label>
            <select
              className={inputClass}
              value={draft.priority}
              onChange={(e) => setDraft({ ...draft, priority: e.target.value as Task['priority'] })}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>마감일</label>
            <input
              type="date"
              className={inputClass}
              value={draft.dueDate}
              onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>진척률 ({draft.progress}%)</label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              className="mt-2.5 w-full"
              value={draft.progress}
              onChange={(e) => setDraft({ ...draft, progress: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </form>
    </Modal>
  )
}
