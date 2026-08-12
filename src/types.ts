export const STATUSES = ['예정', '진행중', '완료', '보류'] as const
export type Status = (typeof STATUSES)[number]

export const PRIORITIES = ['낮음', '보통', '높음', '긴급'] as const
export type Priority = (typeof PRIORITIES)[number]

export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  project: string
  status: Status
  priority: Priority
  progress: number
  dueDate: string
  createdAt: string
  updatedAt: string
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>

export const SCHEDULE_TYPES = ['업무', '회의', '외근', '출장', '교육', '재택', '휴가'] as const
export type ScheduleType = (typeof SCHEDULE_TYPES)[number]

export interface Member {
  id: string
  name: string
  role: string
  contact: string
}

export type MemberDraft = Omit<Member, 'id'>

export interface ScheduleEvent {
  id: string
  memberId: string
  title: string
  type: ScheduleType
  startDate: string
  endDate: string
  allDay: boolean
  startTime: string
  endTime: string
  location: string
  memo: string
  createdAt: string
  updatedAt: string
}

export type ScheduleEventDraft = Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>

export const ASSET_CATEGORIES = ['현금', '예적금', '주식', '펀드', '연금', '부동산', '기타자산'] as const
export type AssetCategory = (typeof ASSET_CATEGORIES)[number]

export const LIABILITY_CATEGORIES = ['대출', '카드대금', '기타부채'] as const
export type LiabilityCategory = (typeof LIABILITY_CATEGORIES)[number]

export type AssetKind = 'asset' | 'liability'

export interface AssetItem {
  id: string
  kind: AssetKind
  name: string
  category: AssetCategory | LiabilityCategory
  institution: string
  amount: number
  memo: string
  updatedAt: string
}

export type AssetDraft = Omit<AssetItem, 'id' | 'updatedAt'>

export const MARKETS = ['미국', '한국', '일본'] as const
export type Market = (typeof MARKETS)[number]

export interface MarketBriefing {
  id: string
  market: Market
  date: string
  summary: string
  createdAt: string
}

export type MarketBriefingDraft = Omit<MarketBriefing, 'id' | 'createdAt'>
