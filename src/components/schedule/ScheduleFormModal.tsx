import { useState } from 'react'
import type { FormEvent } from 'react'
import { SCHEDULE_TYPES } from '../../types'
import type { Member, ScheduleEvent, ScheduleEventDraft } from '../../types'
import { Modal } from '../Modal'

interface ScheduleFormModalProps {
  event: ScheduleEvent | null
  members: Member[]
  defaults: { memberId: string; date: string }
  onSave: (draft: ScheduleEventDraft) => void
  onDelete: (id: string) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
const labelClass = 'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

function toDraft(event: ScheduleEvent): ScheduleEventDraft {
  return {
    memberId: event.memberId,
    title: event.title,
    type: event.type,
    startDate: event.startDate,
    endDate: event.endDate,
    allDay: event.allDay,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    memo: event.memo,
  }
}

export function ScheduleFormModal({
  event,
  members,
  defaults,
  onSave,
  onDelete,
  onClose,
}: ScheduleFormModalProps) {
  const [draft, setDraft] = useState<ScheduleEventDraft>(
    event
      ? toDraft(event)
      : {
          memberId: defaults.memberId || members[0]?.id || '',
          title: '',
          type: '업무',
          startDate: defaults.date,
          endDate: defaults.date,
          allDay: false,
          startTime: '09:00',
          endTime: '18:00',
          location: '',
          memo: '',
        },
  )
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.title.trim()) return
    if (!draft.memberId) {
      setError('담당 부서원을 선택해 주세요.')
      return
    }
    if (draft.endDate < draft.startDate) {
      setError('종료일은 시작일보다 빠를 수 없습니다.')
      return
    }
    if (!draft.allDay && draft.endTime <= draft.startTime && draft.startDate === draft.endDate) {
      setError('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }
    onSave({ ...draft, title: draft.title.trim() })
  }

  const setStartDate = (startDate: string) => {
    setDraft((prev) => ({
      ...prev,
      startDate,
      endDate: prev.endDate < startDate ? startDate : prev.endDate,
    }))
  }

  return (
    <Modal title={event ? '일정 수정' : '새 일정'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>일정명</label>
          <input
            required
            className={inputClass}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="예) 주간 팀 회의"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>담당 부서원</label>
            <select
              className={inputClass}
              value={draft.memberId}
              onChange={(e) => setDraft({ ...draft, memberId: e.target.value })}
            >
              {members.length === 0 && <option value="">부서원 없음</option>}
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>유형</label>
            <select
              className={inputClass}
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as ScheduleEvent['type'] })}
            >
              {SCHEDULE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>시작일</label>
            <input
              type="date"
              required
              className={inputClass}
              value={draft.startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>종료일</label>
            <input
              type="date"
              required
              min={draft.startDate}
              className={inputClass}
              value={draft.endDate}
              onChange={(e) => setDraft({ ...draft, endDate: e.target.value })}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={draft.allDay}
            onChange={(e) => setDraft({ ...draft, allDay: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300"
          />
          종일 일정
        </label>

        {!draft.allDay && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>시작 시간</label>
              <input
                type="time"
                className={inputClass}
                value={draft.startTime}
                onChange={(e) => setDraft({ ...draft, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>종료 시간</label>
              <input
                type="time"
                className={inputClass}
                value={draft.endTime}
                onChange={(e) => setDraft({ ...draft, endTime: e.target.value })}
              />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>장소</label>
          <input
            className={inputClass}
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            placeholder="회의실, 고객사 등 (선택)"
          />
        </div>

        <div>
          <label className={labelClass}>메모</label>
          <textarea
            className={inputClass}
            rows={2}
            value={draft.memo}
            onChange={(e) => setDraft({ ...draft, memo: e.target.value })}
            placeholder="공유할 내용 (선택)"
          />
        </div>

        {error && <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}

        <div className="mt-2 flex items-center justify-between gap-2">
          {event ? (
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              삭제
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
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
        </div>
      </form>
    </Modal>
  )
}
