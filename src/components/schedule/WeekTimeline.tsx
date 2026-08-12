import type { Member, ScheduleEvent } from '../../types'
import {
  WEEKDAY_LABELS,
  formatDayLabel,
  occursOn,
  scheduleTypeStyles,
  timeLabel,
  todayKey,
} from '../../lib/schedule'

interface WeekTimelineProps {
  members: Member[]
  events: ScheduleEvent[]
  days: string[]
  conflicts: Set<string>
  onSelectEvent: (event: ScheduleEvent) => void
  onCreateAt: (memberId: string, dayKey: string) => void
}

function sortEvents(events: ScheduleEvent[]) {
  return [...events].sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1
    return a.startTime.localeCompare(b.startTime)
  })
}

export function WeekTimeline({
  members,
  events,
  days,
  conflicts,
  onSelectEvent,
  onCreateAt,
}: WeekTimelineProps) {
  const today = todayKey()

  if (members.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400 dark:border-slate-700">
        등록된 부서원이 없습니다. ‘부서원 관리’에서 먼저 추가해 주세요.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-[900px]">
        <div className="grid grid-cols-[150px_repeat(7,minmax(0,1fr))] border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">부서원</div>
          {days.map((dayKey, i) => (
            <div
              key={dayKey}
              className={`border-l border-slate-200 px-2 py-2 text-center dark:border-slate-800 ${
                dayKey === today ? 'bg-blue-50 dark:bg-blue-950/30' : ''
              }`}
            >
              <p
                className={`text-xs font-semibold ${
                  i === 5
                    ? 'text-blue-500'
                    : i === 6
                      ? 'text-red-500'
                      : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {WEEKDAY_LABELS[i]}
              </p>
              <p className="text-[11px] text-slate-400">{formatDayLabel(dayKey)}</p>
            </div>
          ))}
        </div>

        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-[150px_repeat(7,minmax(0,1fr))] border-b border-slate-100 last:border-b-0 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 px-3 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {member.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                  {member.name}
                </p>
                <p className="truncate text-[11px] text-slate-400">{member.role}</p>
              </div>
            </div>

            {days.map((dayKey) => {
              const cellEvents = sortEvents(
                events.filter((e) => e.memberId === member.id && occursOn(e, dayKey)),
              )
              return (
                <div
                  key={dayKey}
                  className={`group/cell relative min-h-[74px] space-y-1 border-l border-slate-100 p-1.5 dark:border-slate-800 ${
                    dayKey === today ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  {cellEvents.map((event) => {
                    const styles = scheduleTypeStyles[event.type]
                    const continued = event.startDate < dayKey
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => onSelectEvent(event)}
                        title={`${event.title} · ${event.type} · ${timeLabel(event)}`}
                        className={`block w-full rounded-md border px-1.5 py-1 text-left transition hover:brightness-95 ${styles.bar} ${
                          conflicts.has(event.id) ? 'ring-1 ring-red-400' : ''
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
                          <span className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-200">
                            {continued ? '↳ ' : ''}
                            {event.title}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-[10px] text-slate-500 dark:text-slate-400">
                          {timeLabel(event)}
                          {event.location ? ` · ${event.location}` : ''}
                        </span>
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => onCreateAt(member.id, dayKey)}
                    aria-label={`${member.name} ${formatDayLabel(dayKey)} 일정 추가`}
                    className="absolute right-1 top-1 rounded p-0.5 text-xs text-slate-300 opacity-0 transition group-hover/cell:opacity-100 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    ＋
                  </button>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
