import type { Member, ScheduleEvent } from '../../types'
import { AWAY_TYPES, formatDayLabel, occursOn, scheduleTypeStyles, timeLabel, todayKey } from '../../lib/schedule'

interface DayAgendaProps {
  members: Member[]
  events: ScheduleEvent[]
  dayKey: string
}

export function DayAgenda({ members, events, dayKey }: DayAgendaProps) {
  const dayEvents = events.filter((e) => occursOn(e, dayKey))
  const isToday = dayKey === todayKey()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {isToday ? '오늘' : formatDayLabel(dayKey)} 부서 현황
        </h3>
        <span className="text-xs text-slate-400">{dayEvents.length}건</span>
      </div>

      <ul className="flex flex-col gap-2">
        {members.map((member) => {
          const memberEvents = dayEvents
            .filter((e) => e.memberId === member.id)
            .sort((a, b) => {
              if (a.allDay !== b.allDay) return a.allDay ? -1 : 1
              return a.startTime.localeCompare(b.startTime)
            })
          const away = memberEvents.find((e) => AWAY_TYPES.includes(e.type))

          return (
            <li
              key={member.id}
              className="flex flex-col gap-1.5 rounded-lg bg-slate-50 px-3 py-2.5 sm:flex-row sm:items-start sm:gap-3 dark:bg-slate-800/50"
            >
              <div className="flex w-32 shrink-0 items-center gap-2">
                <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                  {member.name}
                </span>
                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    away
                      ? scheduleTypeStyles[away.type].chip
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}
                >
                  {away ? away.type : '근무'}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                {memberEvents.length === 0 && (
                  <span className="text-xs text-slate-400">등록된 일정 없음</span>
                )}
                {memberEvents.map((event) => (
                  <span
                    key={event.id}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs ${scheduleTypeStyles[event.type].chip}`}
                  >
                    <span className="font-medium">{event.title}</span>
                    <span className="opacity-70">{timeLabel(event)}</span>
                  </span>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
