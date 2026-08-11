import { useState } from 'react'
import type { FormEvent } from 'react'
import { ASSET_CATEGORIES, LIABILITY_CATEGORIES } from '../../types'
import type { AssetDraft, AssetItem, AssetKind } from '../../types'
import { Modal } from '../Modal'

interface AssetFormModalProps {
  item: AssetItem | null
  onSave: (draft: AssetDraft) => void
  onClose: () => void
}

function defaultDraft(kind: AssetKind): AssetDraft {
  return {
    kind,
    name: '',
    category: kind === 'asset' ? ASSET_CATEGORIES[0] : LIABILITY_CATEGORIES[0],
    institution: '',
    amount: 0,
    memo: '',
  }
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
const labelClass = 'mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400'

export function AssetFormModal({ item, onSave, onClose }: AssetFormModalProps) {
  const [draft, setDraft] = useState<AssetDraft>(
    item
      ? {
          kind: item.kind,
          name: item.name,
          category: item.category,
          institution: item.institution,
          amount: item.amount,
          memo: item.memo,
        }
      : defaultDraft('asset'),
  )

  const categoryOptions = draft.kind === 'asset' ? ASSET_CATEGORIES : LIABILITY_CATEGORIES

  const handleKindChange = (kind: AssetKind) => {
    setDraft({ ...draft, kind, category: kind === 'asset' ? ASSET_CATEGORIES[0] : LIABILITY_CATEGORIES[0] })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.name.trim()) return
    onSave(draft)
  }

  return (
    <Modal title={item ? '항목 수정' : '자산/부채 추가'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          {(['asset', 'liability'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleKindChange(k)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                draft.kind === k
                  ? 'border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {k === 'asset' ? '자산' : '부채'}
            </button>
          ))}
        </div>
        <div>
          <label className={labelClass}>이름</label>
          <input
            required
            className={inputClass}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="예: 급여통장, 전세자금대출"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>카테고리</label>
            <select
              className={inputClass}
              value={draft.category}
              onChange={(e) => setDraft({ ...draft, category: e.target.value as AssetDraft['category'] })}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>기관</label>
            <input
              className={inputClass}
              value={draft.institution}
              onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
              placeholder="예: 국민은행"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>금액 (원)</label>
          <input
            type="number"
            min={0}
            required
            className={inputClass}
            value={draft.amount}
            onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className={labelClass}>메모</label>
          <input
            className={inputClass}
            value={draft.memo}
            onChange={(e) => setDraft({ ...draft, memo: e.target.value })}
            placeholder="선택 사항"
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
