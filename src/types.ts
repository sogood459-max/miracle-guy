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
