import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORY_BY_ID } from '../constants'
import { useApp, useCategoryId } from '../context/AppContext'
import { Keypad } from '../components/Keypad'
import { RecordList } from '../components/RecordList'
import { Toast } from '../components/Toast'
import { parseAmountInput } from '../lib/keypad'
import { formatAmount } from '../lib/dateUtils'
import {
  addEntry,
  deleteEntry,
  newEntryId,
  updateEntry,
} from '../lib/storage'
import { entryCount, subtotal } from '../lib/totals'
import type { Entry } from '../types'

export function CategoryPage() {
  const navigate = useNavigate()
  const categoryId = useCategoryId()
  const cat = CATEGORY_BY_ID[categoryId]
  const { selectedDate, dayData, setDayData } = useApp()

  const [input, setInput] = useState('')
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const entries = dayData[categoryId] ?? []
  const sub = subtotal(dayData, categoryId)
  const count = entryCount(dayData, categoryId)

  const resetEdit = useCallback(() => {
    setEditingEntry(null)
    setInput('')
  }, [])

  const handleConfirm = async () => {
    const amount = parseAmountInput(input)
    if (amount === null) {
      setToast('请输入有效金额')
      return
    }

    try {
      if (editingEntry) {
        const next = await updateEntry(
          selectedDate,
          categoryId,
          editingEntry.id,
          amount,
        )
        setDayData(next)
        setToast('已更新')
      } else {
        const entry: Entry = {
          id: newEntryId(),
          amount,
          createdAt: new Date().toISOString(),
        }
        const next = await addEntry(selectedDate, categoryId, entry)
        setDayData(next)
        setToast('已记录')
      }
      resetEdit()
    } catch {
      setToast('保存失败')
    }
  }

  const handleSelectEntry = (entry: Entry) => {
    setEditingEntry(entry)
    setInput(String(entry.amount))
  }

  const handleDelete = async (entryId: string) => {
    try {
      const next = await deleteEntry(selectedDate, categoryId, entryId)
      setDayData(next)
      if (editingEntry?.id === entryId) resetEdit()
      setToast('已删除')
    } catch {
      setToast('删除失败')
    }
  }

  const confirmDisabled = parseAmountInput(input) === null

  return (
    <div className="page category-page">
      <header className="category-header">
        <button
          type="button"
          className="btn-back"
          onClick={() => navigate('/')}
          aria-label="返回"
        >
          ←
        </button>
        <div className="category-header-main">
          <h1 className="category-title">{cat.label}</h1>
          <p className="category-meta">
            本类合计 ¥{formatAmount(sub)} · {count}笔
          </p>
        </div>
        {editingEntry && (
          <button type="button" className="btn-text" onClick={resetEdit}>
            取消
          </button>
        )}
      </header>

      <Keypad
        value={input}
        onChange={setInput}
        onConfirm={() => void handleConfirm()}
        confirmLabel={editingEntry ? '保存' : '确认'}
        confirmDisabled={confirmDisabled}
      />

      {editingEntry && (
        <p className="edit-hint">正在编辑 {formatAmount(editingEntry.amount)} 的记录</p>
      )}

      <RecordList
        entries={entries}
        editingId={editingEntry?.id ?? null}
        onSelect={handleSelectEntry}
        onDelete={(id) => void handleDelete(id)}
      />

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  )
}
