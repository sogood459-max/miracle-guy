import type { Member, ScheduleEvent } from '../../types'
import { AWAY_TYPES, occursOn, todayKey } from '../../lib/schedule'

interface ScheduleSummaryProps {
  members: Member[]
  weekEvents: ScheduleEvent[]
  conflicts: Set<string>
  days: string[]
}

export function ScheduleSummary({ members, weekEvents, conflicts, days }: ScheduleSummaryProps) {
  const today = todayKey()
  const todayInWeek = days.includes(today)

  const todayEvents = weekEvents.filter((e) => occursOn(e, today))
  const awayToday = new Set(
    todayEvents.filter((e) => AWAY_TYPES.includes(e.type)).map((e) => e.memberId),
  ).size
  const conflictCount = weekEvents.filter((e) => conflicts.has(e.id)).length

  const cards = [
    { label: '부서원', value: members.length, unit: '명', tone: 'text-slate-900 dark:text-slate-100' },
    { label: '이번 주 일정', value: weekEvents.length, unit: '건', tone: 'text-blue-600 dark:text-blue-400' },
    {
      label: todayInWeek ? '오늘 부재' : '이번 주 부재',
      value: todayInWeek
        ? awayToday
        : new Set(weekEvents.filter((e) => AWAY_TYPES.includes(e.type)).map((e) => e.memberId)).size,
      unit: '명',
      tone: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: '일정 충돌',
      value: conflictCount,
      unit: '건',
      tone: conflictCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400',
    },
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
    </div>
  )
}
