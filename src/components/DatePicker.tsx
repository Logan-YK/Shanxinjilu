import { useMemo, useState } from 'react'
import { formatDateIso, parseIsoDate } from '../lib/dateUtils'

interface DatePickerProps {
  selected: string
  onSelect: (iso: string) => void
  onClose: () => void
}

export function DatePicker({ selected, onSelect, onClose }: DatePickerProps) {
  const initial = parseIsoDate(selected)
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const items: { iso: string | null; day: number }[] = []

    for (let i = 0; i < startPad; i++) {
      items.push({ iso: null, day: 0 })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d)
      items.push({ iso: formatDateIso(date), day: d })
    }
    return items
  }, [viewYear, viewMonth])

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const monthLabel = `${viewYear}年${viewMonth + 1}月`
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="date-picker-overlay" onClick={onClose}>
      <div
        className="date-picker-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="选择日期"
      >
        <div className="date-picker-header">
          <button type="button" className="btn-icon" onClick={prevMonth} aria-label="上个月">
            ‹
          </button>
          <span className="date-picker-title">{monthLabel}</span>
          <button type="button" className="btn-icon" onClick={nextMonth} aria-label="下个月">
            ›
          </button>
        </div>
        <div className="date-picker-weekdays">
          {weekdays.map((w) => (
            <span key={w} className="date-picker-weekday">
              {w}
            </span>
          ))}
        </div>
        <div className="date-picker-grid">
          {cells.map((cell, i) =>
            cell.iso ? (
              <button
                key={cell.iso}
                type="button"
                className={`date-picker-day ${cell.iso === selected ? 'selected' : ''}`}
                onClick={() => {
                  onSelect(cell.iso!)
                  onClose()
                }}
              >
                {cell.day}
              </button>
            ) : (
              <span key={`empty-${i}`} className="date-picker-day empty" />
            ),
          )}
        </div>
        <button type="button" className="btn btn-secondary date-picker-today" onClick={() => {
          const t = formatDateIso(new Date())
          onSelect(t)
          onClose()
        }}>
          今天
        </button>
      </div>
    </div>
  )
}
