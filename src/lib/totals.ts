import { CATEGORIES, DONATION_CATEGORY_IDS } from '../constants'
import type { CategoryId, DayCategories } from '../types'

export function subtotal(data: DayCategories, categoryId: CategoryId): number {
  const entries = data[categoryId] ?? []
  return entries.reduce((sum, e) => sum + e.amount, 0)
}

export function totalDonation(data: DayCategories): number {
  return DONATION_CATEGORY_IDS.reduce(
    (sum, id) => sum + subtotal(data, id),
    0,
  )
}

export function entryCount(data: DayCategories, categoryId: CategoryId): number {
  return (data[categoryId] ?? []).length
}

export function allSubtotals(data: DayCategories): Record<CategoryId, number> {
  return Object.fromEntries(
    CATEGORIES.map((c) => [c.id, subtotal(data, c.id)]),
  ) as Record<CategoryId, number>
}
