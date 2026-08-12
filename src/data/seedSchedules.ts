import type { Member, ScheduleEvent } from '../types'
import { addDays, startOfWeek, toDateKey } from '../lib/schedule'

const now = new Date().toISOString()
const monday = startOfWeek(new Date())
const day = (offset: number) => toDateKey(addDays(monday, offset))

export const seedMembers: Member[] = [
  { id: 'm-kim', name: '김도윤', role: '팀장', contact: 'doyun.kim@example.com' },
  { id: 'm-lee', name: '이서연', role: '백엔드 개발', contact: 'seoyeon.lee@example.com' },
  { id: 'm-park', name: '박지훈', role: 'QA', contact: 'jihun.park@example.com' },
  { id: 'm-choi', name: '최유나', role: 'CS 운영', contact: 'yuna.choi@example.com' },
]

interface SeedInput {
  memberId: string
  title: string
  type: ScheduleEvent['type']
  from: number
  to?: number
  allDay?: boolean
  startTime?: string
  endTime?: string
  location?: string
  memo?: string
}

const seeds: SeedInput[] = [
  {
    memberId: 'm-kim',
    title: '주간 팀 회의',
    type: '회의',
    from: 0,
    startTime: '09:30',
    endTime: '10:30',
    location: '3층 회의실 A',
    memo: '주간 업무 공유 및 이슈 점검',
  },
  {
    memberId: 'm-kim',
    title: '3분기 로드맵 발표',
    type: '회의',
    from: 3,
    startTime: '14:00',
    endTime: '15:30',
    location: '대회의실',
  },
  {
    memberId: 'm-lee',
    title: '주간 팀 회의',
    type: '회의',
    from: 0,
    startTime: '09:30',
    endTime: '10:30',
    location: '3층 회의실 A',
  },
  {
    memberId: 'm-lee',
    title: 'API 인증 모듈 리팩터링',
    type: '업무',
    from: 1,
    to: 2,
    allDay: true,
    memo: 'JWT 갱신 로직 개선',
  },
  {
    memberId: 'm-lee',
    title: '재택근무',
    type: '재택',
    from: 4,
    allDay: true,
  },
  {
    memberId: 'm-park',
    title: '8월 정기 배포 QA',
    type: '업무',
    from: 0,
    to: 2,
    allDay: true,
    memo: '릴리즈 노트 기반 회귀 테스트',
  },
  {
    memberId: 'm-park',
    title: '보안 교육',
    type: '교육',
    from: 3,
    startTime: '13:00',
    endTime: '17:00',
    location: '온라인',
  },
  {
    memberId: 'm-choi',
    title: '연차 휴가',
    type: '휴가',
    from: 2,
    to: 3,
    allDay: true,
  },
  {
    memberId: 'm-choi',
    title: '고객사 온보딩 미팅',
    type: '외근',
    from: 4,
    startTime: '10:00',
    endTime: '12:00',
    location: '강남 고객사',
  },
]

export const seedScheduleEvents: ScheduleEvent[] = seeds.map((s, i) => ({
  id: `s-${i}`,
  memberId: s.memberId,
  title: s.title,
  type: s.type,
  startDate: day(s.from),
  endDate: day(s.to ?? s.from),
  allDay: s.allDay ?? false,
  startTime: s.startTime ?? '09:00',
  endTime: s.endTime ?? '18:00',
  location: s.location ?? '',
  memo: s.memo ?? '',
  createdAt: now,
  updatedAt: now,
}))
