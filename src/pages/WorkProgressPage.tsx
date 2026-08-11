import { useMemo, useState } from 'react'
import { Dashboard } from '../components/Dashboard'
import { FilterBar } from '../components/FilterBar'
import type { Filters } from '../components/FilterBar'
import { KanbanBoard } from '../components/KanbanBoard'
import { TaskFormModal } from '../components/TaskFormModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { seedTasks } from '../data/seed'
import type { Status, Task, TaskDraft } from '../types'

const emptyFilters: Filters = { search: '', status: '', priority: '' }

export function WorkProgressPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('wpm-tasks', seedTasks)
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.status && t.status !== filters.status) return false
      if (filters.priority && t.priority !== filters.priority) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const haystack = `${t.title} ${t.description} ${t.assignee} ${t.project}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [tasks, filters])

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleSave = (draft: TaskDraft) => {
    const now = new Date().toISOString()
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...draft, updatedAt: now } : t)),
      )
    } else {
      setTasks((prev) => [
        ...prev,
        { ...draft, id: crypto.randomUUID(), createdAt: now, updatedAt: now },
      ])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const handleStatusChange = (id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, progress: status === '완료' ? 100 : t.progress, updatedAt: new Date().toISOString() }
          : t,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Dashboard tasks={tasks} />
      <FilterBar filters={filters} onChange={setFilters} onAddTask={openCreate} />
      <KanbanBoard
        tasks={filteredTasks}
        onEdit={openEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
      {modalOpen && (
        <TaskFormModal task={editingTask} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
