import { useRef, useState } from 'react'
import { formatAmount, formatTime } from '../lib/dateUtils'
import type { Entry } from '../types'

interface RecordListProps {
  entries: Entry[]
  editingId: string | null
  onSelect: (entry: Entry) => void
  onDelete: (entryId: string) => void
}

const SWIPE_THRESHOLD = 60

export function RecordList({
  entries,
  editingId,
  onSelect,
  onDelete,
}: RecordListProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (sorted.length === 0) {
    return (
      <p className="record-empty">暂无记录，在上方输入金额后点确认</p>
    )
  }

  return (
    <ul className="record-list">
      {sorted.map((entry) => (
        <RecordRow
          key={entry.id}
          entry={entry}
          active={editingId === entry.id}
          onSelect={() => onSelect(entry)}
          onDelete={() => onDelete(entry.id)}
        />
      ))}
    </ul>
  )
}

function RecordRow({
  entry,
  active,
  onSelect,
  onDelete,
}: {
  entry: Entry
  active: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const [offset, setOffset] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const startX = useRef(0)
  const dragging = useRef(false)

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    dragging.current = true
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return
    const dx = e.touches[0].clientX - startX.current
    if (dx < 0) {
      setOffset(Math.max(dx, -88))
    } else if (revealed) {
      setOffset(Math.min(dx - 88, 0))
    }
  }

  const onTouchEnd = () => {
    dragging.current = false
    if (offset < -SWIPE_THRESHOLD) {
      setOffset(-88)
      setRevealed(true)
    } else {
      setOffset(0)
      setRevealed(false)
    }
  }

  const handleDeleteClick = () => {
    if (window.confirm('删除这条记录？')) {
      onDelete()
    } else {
      setOffset(0)
      setRevealed(false)
    }
  }

  return (
    <li className={`record-item ${active ? 'record-item-active' : ''}`}>
      <div className="record-delete-action">
        <button type="button" className="record-delete-btn" onClick={handleDeleteClick}>
          删除
        </button>
      </div>
      <button
        type="button"
        className="record-row"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onSelect}
      >
        <span className="record-amount">{formatAmount(entry.amount)}</span>
        <span className="record-time">{formatTime(entry.createdAt)}</span>
      </button>
    </li>
  )
}
