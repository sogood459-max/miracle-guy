import type { ScheduleEvent, ScheduleType } from '../types'

export const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'] as const

/** yyyy-mm-dd (로컬 기준). 문자열끼리 사전순 비교 = 날짜 비교. */
export function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = `${date.getMonth() + 1}`.padStart(2, '0')
  const d = `${date.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** 월요일 시작 주의 첫 날 */
export function startOfWeek(date: Date) {
  const day = date.getDay()
  return addDays(date, day === 0 ? -6 : 1 - day)
}

export function weekDays(weekStart: string) {
  const start = parseDateKey(weekStart)
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(start, i)))
}

export function todayKey() {
  return toDateKey(new Date())
}

export function formatDayLabel(key: string) {
  const d = parseDateKey(key)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function formatWeekRange(weekStart: string) {
  const start = parseDateKey(weekStart)
  const end = addDays(start, 6)
  const sameMonth = start.getMonth() === end.getMonth()
  const head = `${start.getFullYear()}년 ${start.getMonth() + 1}월 ${start.getDate()}일`
  const tail = sameMonth ? `${end.getDate()}일` : `${end.getMonth() + 1}월 ${end.getDate()}일`
  return `${head} ~ ${tail}`
}

export function occursOn(event: ScheduleEvent, dayKey: string) {
  return event.startDate <= dayKey && dayKey <= event.endDate
}

export function isMultiDay(event: ScheduleEvent) {
  return event.startDate !== event.endDate
}

export function timeLabel(event: ScheduleEvent) {
  if (event.allDay) return '종일'
  return `${event.startTime}~${event.endTime}`
}

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** 같은 날 같은 담당자의 시간이 겹치는 일정 id 집합 (종일 일정은 제외) */
export function conflictingEventIds(events: ScheduleEvent[]) {
  const conflicts = new Set<string>()
  const timed = events.filter((e) => !e.allDay)

  for (let i = 0; i < timed.length; i += 1) {
    for (let j = i + 1; j < timed.length; j += 1) {
      const a = timed[i]
      const b = timed[j]
      if (a.memberId !== b.memberId) continue
      if (a.endDate < b.startDate || b.endDate < a.startDate) continue
      if (toMinutes(a.startTime) < toMinutes(b.endTime) && toMinutes(b.startTime) < toMinutes(a.endTime)) {
        conflicts.add(a.id)
        conflicts.add(b.id)
      }
    }
  }
  return conflicts
}

export const scheduleTypeStyles: Record<ScheduleType, { chip: string; bar: string; dot: string }> = {
  업무: {
    chip: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    bar: 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60',
    dot: 'bg-slate-400',
  },
  회의: {
    chip: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    bar: 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40',
    dot: 'bg-blue-500',
  },
  외근: {
    chip: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    bar: 'border-cyan-300 bg-cyan-50 dark:border-cyan-800 dark:bg-cyan-950/40',
    dot: 'bg-cyan-500',
  },
  출장: {
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    bar: 'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40',
    dot: 'bg-violet-500',
  },
  교육: {
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    bar: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
    dot: 'bg-emerald-500',
  },
  재택: {
    chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    bar: 'border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/40',
    dot: 'bg-indigo-500',
  },
  휴가: {
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    bar: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
    dot: 'bg-amber-500',
  },
}

/** 부재로 간주하는 일정 유형 */
export const AWAY_TYPES: ScheduleType[] = ['휴가', '출장', '외근']
