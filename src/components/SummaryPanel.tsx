import { CATEGORIES, DONATION_CATEGORY_IDS } from '../constants'
import { formatAmount } from '../lib/dateUtils'
import { subtotal, totalDonation } from '../lib/totals'
import type { DayCategories } from '../types'

export function SummaryPanel({ data }: { data: DayCategories }) {
  const total = totalDonation(data)
  const fangsheng = subtotal(data, 'fangsheng')

  const previewParts = DONATION_CATEGORY_IDS.map((id) => {
    const cat = CATEGORIES.find((c) => c.id === id)!
    const amount = subtotal(data, id)
    return `${cat.label} ${formatAmount(amount)}`
  })

  return (
    <section className="summary-panel">
      <div className="summary-total-row">
        <span className="summary-label">总善款</span>
        <span className="summary-total">¥ {formatAmount(total)}</span>
      </div>
      <p className="summary-preview">{previewParts.join(' · ')}</p>
      <p className="summary-fangsheng">
        放生（不计入总善款）¥ {formatAmount(fangsheng)}
      </p>
    </section>
  )
}
