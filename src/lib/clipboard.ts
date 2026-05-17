import { CATEGORIES, DONATION_CATEGORY_IDS } from '../constants'
import { formatAmount } from './dateUtils'
import { subtotal, totalDonation } from './totals'
import type { DayCategories } from '../types'

export function buildMainCopyText(date: string, data: DayCategories): string {
  const total = totalDonation(data)
  const lines: string[] = [date, `总善款：${formatAmount(total)}`]

  for (const id of DONATION_CATEGORY_IDS) {
    const amount = subtotal(data, id)
    if (amount > 0) {
      const label = CATEGORIES.find((c) => c.id === id)!.label
      lines.push(`${label}：${formatAmount(amount)}`)
    }
  }

  return lines.join('\n')
}

export function buildFangshengCopyText(date: string, data: DayCategories): string {
  const amount = subtotal(data, 'fangsheng')
  return `${date}\n放生：${formatAmount(amount)}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fallback */
  }

  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } finally {
    document.body.removeChild(ta)
  }
  return ok
}
