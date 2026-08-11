import { useState } from 'react'
import { AssetBreakdown } from '../components/assets/AssetBreakdown'
import { AssetFormModal } from '../components/assets/AssetFormModal'
import { AssetSummary } from '../components/assets/AssetSummary'
import { AssetTable } from '../components/assets/AssetTable'
import { MarketBriefingFormModal } from '../components/assets/MarketBriefingFormModal'
import { MarketBriefingSection } from '../components/assets/MarketBriefingSection'
import { seedAssets } from '../data/seedAssets'
import { seedBriefings } from '../data/seedBriefings'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { AssetDraft, AssetItem, MarketBriefing, MarketBriefingDraft } from '../types'

export function AssetsPage() {
  const [items, setItems] = useLocalStorage<AssetItem[]>('wpm-assets', seedAssets)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AssetItem | null>(null)

  const [briefings, setBriefings] = useLocalStorage<MarketBriefing[]>('wpm-market-briefings', seedBriefings)
  const [briefingModalOpen, setBriefingModalOpen] = useState(false)
  const [editingBriefing, setEditingBriefing] = useState<MarketBriefing | null>(null)

  const openCreate = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEdit = (item: AssetItem) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleSave = (draft: AssetDraft) => {
    const now = new Date().toISOString()
    if (editingItem) {
      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? { ...i, ...draft, updatedAt: now } : i)))
    } else {
      setItems((prev) => [...prev, { ...draft, id: crypto.randomUUID(), updatedAt: now }])
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const openBriefingCreate = () => {
    setEditingBriefing(null)
    setBriefingModalOpen(true)
  }

  const openBriefingEdit = (item: MarketBriefing) => {
    setEditingBriefing(item)
    setBriefingModalOpen(true)
  }

  const handleBriefingSave = (draft: MarketBriefingDraft) => {
    if (editingBriefing) {
      setBriefings((prev) => prev.map((b) => (b.id === editingBriefing.id ? { ...b, ...draft } : b)))
    } else {
      setBriefings((prev) => [...prev, { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }])
    }
    setBriefingModalOpen(false)
  }

  const handleBriefingDelete = (id: string) => {
    setBriefings((prev) => prev.filter((b) => b.id !== id))
  }

  const sortedItems = [...items].sort((a, b) => b.amount - a.amount)

  return (
    <div className="flex flex-col gap-6">
      <AssetSummary items={items} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AssetBreakdown items={items} />
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              + 항목 추가
            </button>
          </div>
          <AssetTable items={sortedItems} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      </div>

      <MarketBriefingSection
        items={briefings}
        onAdd={openBriefingCreate}
        onEdit={openBriefingEdit}
        onDelete={handleBriefingDelete}
      />

      {modalOpen && (
        <AssetFormModal item={editingItem} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}
      {briefingModalOpen && (
        <MarketBriefingFormModal
          item={editingBriefing}
          onSave={handleBriefingSave}
          onClose={() => setBriefingModalOpen(false)}
        />
      )}
    </div>
  )
}
