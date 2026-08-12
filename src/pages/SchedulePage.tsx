import { useMemo, useState } from 'react'
import { DayAgenda } from '../components/schedule/DayAgenda'
import { MemberManagerModal } from '../components/schedule/MemberManagerModal'
import { ScheduleFormModal } from '../components/schedule/ScheduleFormModal'
import { ScheduleSummary } from '../components/schedule/ScheduleSummary'
import { ScheduleToolbar } from '../components/schedule/ScheduleToolbar'
import type { ScheduleFilters } from '../components/schedule/ScheduleToolbar'
import { WeekTimeline } from '../components/schedule/WeekTimeline'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedMembers, seedScheduleEvents } from '../data/seedSchedules'
import {
  addDays,
  conflictingEventIds,
  occursOn,
  parseDateKey,
  startOfWeek,
  toDateKey,
  todayKey,
  weekDays,
} from '../lib/schedule'
import type { Member, MemberDraft, ScheduleEvent, ScheduleEventDraft } from '../types'

const emptyFilters: ScheduleFilters = { search: '', memberId: '', type: '' }

export function SchedulePage() {
  const [members, setMembers] = useLocalStorage<Member[]>('tsm-members', seedMembers)
  const [events, setEvents] = useLocalStorage<ScheduleEvent[]>('tsm-events', seedScheduleEvents)
  const [weekStart, setWeekStart] = useState(() => toDateKey(startOfWeek(new Date())))
  const [filters, setFilters] = useState<ScheduleFilters>(emptyFilters)
  const [eventModal, setEventModal] = useState<{
    event: ScheduleEvent | null
    defaults: { memberId: string; date: string }
  } | null>(null)
  const [membersModalOpen, setMembersModalOpen] = useState(false)

  const days = useMemo(() => weekDays(weekStart), [weekStart])

  const visibleMembers = useMemo(
    () => (filters.memberId ? members.filter((m) => m.id === filters.memberId) : members),
    [members, filters.memberId],
  )

  const filteredEvents = useMemo(() => {
    const memberName = new Map(members.map((m) => [m.id, m.name]))
    return events.filter((e) => {
      if (filters.memberId && e.memberId !== filters.memberId) return false
      if (filters.type && e.type !== filters.type) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const haystack =
          `${e.title} ${e.location} ${e.memo} ${e.type} ${memberName.get(e.memberId) ?? ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [events, members, filters])

  const weekEvents = useMemo(
    () => filteredEvents.filter((e) => days.some((d) => occursOn(e, d))),
    [filteredEvents, days],
  )

  const conflicts = useMemo(() => conflictingEventIds(weekEvents), [weekEvents])

  const agendaDay = days.includes(todayKey()) ? todayKey() : days[0]

  const shiftWeek = (weeks: number) => {
    setWeekStart(toDateKey(addDays(parseDateKey(weekStart), weeks * 7)))
  }

  const openCreate = (memberId = '', date = agendaDay) => {
    setEventModal({ event: null, defaults: { memberId, date } })
  }

  const handleSaveEvent = (draft: ScheduleEventDraft) => {
    const now = new Date().toISOString()
    const editing = eventModal?.event
    if (editing) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...draft, updatedAt: now } : e)),
      )
    } else {
      setEvents((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), createdAt: now, updatedAt: now },
      ])
    }
    setEventModal(null)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    setEventModal(null)
  }

  const handleAddMember = (draft: MemberDraft) => {
    setMembers((prev) => [...prev, { ...draft, id: crypto.randomUUID() }])
  }

  const handleUpdateMember = (id: string, draft: MemberDraft) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...draft } : m)))
  }

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
    setEvents((prev) => prev.filter((e) => e.memberId !== id))
    setFilters((prev) => (prev.memberId === id ? { ...prev, memberId: '' } : prev))
  }

  const eventCounts = useMemo(() => {
    return events.reduce<Record<string, number>>((acc, e) => {
      acc[e.memberId] = (acc[e.memberId] ?? 0) + 1
      return acc
    }, {})
  }, [events])

  return (
    <div className="flex flex-col gap-6">
      <ScheduleSummary
        members={visibleMembers}
        weekEvents={weekEvents}
        conflicts={conflicts}
        days={days}
      />
      <ScheduleToolbar
        weekStart={weekStart}
        filters={filters}
        members={members}
        onFiltersChange={setFilters}
        onWeekShift={shiftWeek}
        onToday={() => setWeekStart(toDateKey(startOfWeek(new Date())))}
        onManageMembers={() => setMembersModalOpen(true)}
        onAddEvent={() => openCreate()}
      />
      <WeekTimeline
        members={visibleMembers}
        events={weekEvents}
        days={days}
        conflicts={conflicts}
        onSelectEvent={(event) =>
          setEventModal({ event, defaults: { memberId: event.memberId, date: event.startDate } })
        }
        onCreateAt={(memberId, dayKey) => openCreate(memberId, dayKey)}
      />
      <DayAgenda members={visibleMembers} events={weekEvents} dayKey={agendaDay} />

      {eventModal && (
        <ScheduleFormModal
          event={eventModal.event}
          members={members}
          defaults={eventModal.defaults}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => setEventModal(null)}
        />
      )}
      {membersModalOpen && (
        <MemberManagerModal
          members={members}
          eventCounts={eventCounts}
          onAdd={handleAddMember}
          onUpdate={handleUpdateMember}
          onDelete={handleDeleteMember}
          onClose={() => setMembersModalOpen(false)}
        />
      )}
    </div>
  )
}
