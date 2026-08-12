import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Member, MemberDraft } from '../../types'
import { Modal } from '../Modal'

interface MemberManagerModalProps {
  members: Member[]
  eventCounts: Record<string, number>
  onAdd: (draft: MemberDraft) => void
  onUpdate: (id: string, draft: MemberDraft) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'

const emptyDraft: MemberDraft = { name: '', role: '', contact: '' }

export function MemberManagerModal({
  members,
  eventCounts,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: MemberManagerModalProps) {
  const [draft, setDraft] = useState<MemberDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = draft.name.trim()
    if (!name) return
    if (editingId) {
      onUpdate(editingId, { ...draft, name })
      setEditingId(null)
    } else {
      onAdd({ ...draft, name })
    }
    setDraft(emptyDraft)
  }

  const startEdit = (member: Member) => {
    setEditingId(member.id)
    setDraft({ name: member.name, role: member.role, contact: member.contact })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(emptyDraft)
  }

  const handleDelete = (member: Member) => {
    const count = eventCounts[member.id] ?? 0
    const message =
      count > 0
        ? `${member.name} 님과 등록된 일정 ${count}건이 함께 삭제됩니다. 계속할까요?`
        : `${member.name} 님을 삭제할까요?`
    if (!window.confirm(message)) return
    if (editingId === member.id) cancelEdit()
    onDelete(member.id)
  }

  return (
    <Modal title="부서원 관리" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <ul className="flex flex-col gap-2">
          {members.length === 0 && (
            <li className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-700">
              등록된 부서원이 없습니다.
            </li>
          )}
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-800"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {member.name}
                  <span className="ml-2 text-xs font-normal text-slate-400">{member.role}</span>
                </p>
                <p className="truncate text-[11px] text-slate-400">
                  {member.contact || '연락처 미등록'} · 일정 {eventCounts[member.id] ?? 0}건
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(member)}
                  aria-label={`${member.name} 수정`}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member)}
                  aria-label={`${member.name} 삭제`}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {editingId ? '부서원 정보 수정' : '부서원 추가'}
          </p>
          <input
            required
            className={inputClass}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="이름"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className={inputClass}
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              placeholder="직무/직급"
            />
            <input
              className={inputClass}
              value={draft.contact}
              onChange={(e) => setDraft({ ...draft, contact: e.target.value })}
              placeholder="연락처 (선택)"
            />
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {editingId ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
