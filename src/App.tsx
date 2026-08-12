import { useState } from 'react'
import { AssetsPage } from './pages/AssetsPage'
import { SchedulePage } from './pages/SchedulePage'
import { WorkProgressPage } from './pages/WorkProgressPage'

type Tab = 'work' | 'schedule' | 'assets'

const TABS: { key: Tab; label: string }[] = [
  { key: 'work', label: '업무 진척 관리' },
  { key: 'schedule', label: '부서 일정 관리' },
  { key: 'assets', label: '자산 관리' },
]

function App() {
  const [tab, setTab] = useState<Tab>('work')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Miracle Guy</h1>
          <nav className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition ${
                  tab === t.key
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'work' && <WorkProgressPage />}
        {tab === 'schedule' && <SchedulePage />}
        {tab === 'assets' && <AssetsPage />}
      </main>
    </div>
  )
}

export default App
