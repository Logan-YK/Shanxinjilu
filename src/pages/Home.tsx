import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../constants'
import { useApp } from '../context/AppContext'
import { DatePicker } from '../components/DatePicker'
import { SummaryPanel } from '../components/SummaryPanel'
import { Toast } from '../components/Toast'
import {
  buildFangshengCopyText,
  buildMainCopyText,
  copyToClipboard,
} from '../lib/clipboard'
import { formatAmount, formatDisplayDate } from '../lib/dateUtils'
import { subtotal } from '../lib/totals'

export function Home() {
  const navigate = useNavigate()
  const {
    selectedDate,
    setSelectedDate,
    dayData,
    loading,
    totalDonation,
    fangshengTotal,
  } = useApp()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const copyMain = async () => {
    if (totalDonation <= 0) {
      setToast('暂无数据')
      return
    }
    const text = buildMainCopyText(selectedDate, dayData)
    const ok = await copyToClipboard(text)
    setToast(ok ? '已复制善款汇总' : '复制失败，请重试')
  }

  const copyFangsheng = async () => {
    if (fangshengTotal <= 0) {
      setToast('暂无数据')
      return
    }
    const text = buildFangshengCopyText(selectedDate, dayData)
    const ok = await copyToClipboard(text)
    setToast(ok ? '已复制放生信息' : '复制失败，请重试')
  }

  return (
    <div className="page home-page">
      <header className="home-header">
        <button
          type="button"
          className="date-btn"
          onClick={() => setShowDatePicker(true)}
        >
          <span className="date-btn-icon" aria-hidden>
            📅
          </span>
          <span className="date-btn-text">{formatDisplayDate(selectedDate)}</span>
        </button>
        <h1 className="app-title">善心记录</h1>
      </header>

      {loading ? (
        <p className="loading-hint">加载中…</p>
      ) : (
        <SummaryPanel data={dayData} />
      )}

      <div className="category-grid">
        {CATEGORIES.map((cat) => {
          const amount = subtotal(dayData, cat.id)
          return (
            <button
              key={cat.id}
              type="button"
              className="category-btn"
              onClick={() => navigate(`/category/${cat.id}`)}
            >
              <span className="category-btn-label">{cat.label}</span>
              <span className="category-btn-amount">¥{formatAmount(amount)}</span>
            </button>
          )
        })}
      </div>

      <div className="copy-section">
        <button
          type="button"
          className="btn btn-copy"
          disabled={totalDonation <= 0}
          onClick={() => void copyMain()}
        >
          复制善款汇总
        </button>
        <button
          type="button"
          className="btn btn-copy btn-copy-secondary"
          disabled={fangshengTotal <= 0}
          onClick={() => void copyFangsheng()}
        >
          复制放生信息
        </button>
      </div>

      {showDatePicker && (
        <DatePicker
          selected={selectedDate}
          onSelect={setSelectedDate}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  )
}
