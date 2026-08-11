import { useState } from 'react'
import type { FormEvent } from 'react'
import { MARKETS } from '../../types'
import type { MarketBriefing, MarketBriefingDraft } from '../../types'
import { Modal } from '../Modal'

interface MarketBriefingFormModalProps {
  item: MarketBriefing | null
  onSave: (draft: MarketBriefingDraft) => void
  onClose: () => void
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
const labelClass = 'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

function defaultDraft(): MarketBriefingDraft {
  return {
    market: '미국',
    date: new Date().toISOString().slice(0, 10),
    summary: '',
  }
}

export function MarketBriefingFormModal({ item, onSave, onClose }: MarketBriefingFormModalProps) {
  const [draft, setDraft] = useState<MarketBriefingDraft>(
    item ? { market: item.market, date: item.date, summary: item.summary } : defaultDraft(),
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.summary.trim()) return
    onSave(draft)
  }

  return (
    <Modal title={item ? '브리핑 수정' : '시장 브리핑 추가'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>시장</label>
            <select
              className={inputClass}
              value={draft.market}
              onChange={(e) => setDraft({ ...draft, market: e.target.value as MarketBriefingDraft['market'] })}
            >
              {MARKETS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>날짜</label>
            <input
              type="date"
              className={inputClass}
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>브리핑 내용</label>
          <textarea
            required
            rows={5}
            className={inputClass}
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            placeholder="지수 등락, 주요 이슈, 변동성 큰 종목 등을 붙여넣으세요"
          />
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            취소
          </button>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </form>
    </Modal>
  )
}
