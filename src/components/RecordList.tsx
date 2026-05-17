import { formatAmount, formatTime } from '../lib/dateUtils'
import type { Entry } from '../types'

interface RecordListProps {
  entries: Entry[]
  editingId: string | null
  onSelect: (entry: Entry) => void
  onDelete: (entryId: string) => void
}

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
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('删除这条记录？')) {
      onDelete()
    }
  }

  return (
    <li className={`record-item ${active ? 'record-item-active' : ''}`}>
      <div
        className="record-row"
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect()
          }
        }}
      >
        <span className="record-amount">{formatAmount(entry.amount)}</span>
        <div className="record-row-end">
          <span className="record-time">{formatTime(entry.createdAt)}</span>
          <button
            type="button"
            className="record-delete-inline"
            onClick={handleDelete}
            aria-label="删除记录"
          >
            删除
          </button>
        </div>
      </div>
    </li>
  )
}
