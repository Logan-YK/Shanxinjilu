import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { LAST_VIEWED_KEY } from '../constants'
import { getDay } from '../lib/storage'
import { todayIso } from '../lib/dateUtils'
import { totalDonation, subtotal } from '../lib/totals'
import type { CategoryId, DayCategories } from '../types'

interface AppContextValue {
  selectedDate: string
  setSelectedDate: (date: string) => void
  dayData: DayCategories
  loading: boolean
  refreshDay: () => Promise<void>
  setDayData: (data: DayCategories) => void
  totalDonation: number
  fangshengTotal: number
}

const AppContext = createContext<AppContextValue | null>(null)

function loadInitialDate(): string {
  try {
    const stored = localStorage.getItem(LAST_VIEWED_KEY)
    if (stored && /^\d{4}-\d{2}-\d{2}$/.test(stored)) {
      return stored
    }
  } catch {
    /* ignore */
  }
  return todayIso()
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDateState] = useState(loadInitialDate)
  const [dayData, setDayData] = useState<DayCategories>({})
  const [loading, setLoading] = useState(true)

  const setSelectedDate = useCallback((date: string) => {
    setSelectedDateState(date)
    try {
      localStorage.setItem(LAST_VIEWED_KEY, date)
    } catch {
      /* ignore */
    }
  }, [])

  const refreshDay = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDay(selectedDate)
      setDayData(data)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => {
    void refreshDay()
  }, [refreshDay])

  const value = useMemo<AppContextValue>(
    () => ({
      selectedDate,
      setSelectedDate,
      dayData,
      loading,
      refreshDay,
      setDayData,
      totalDonation: totalDonation(dayData),
      fangshengTotal: subtotal(dayData, 'fangsheng'),
    }),
    [selectedDate, setSelectedDate, dayData, loading, refreshDay],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useCategoryId(): CategoryId {
  const id = useContext(CategoryIdContext)
  if (!id) throw new Error('useCategoryId outside category route')
  return id
}

const CategoryIdContext = createContext<CategoryId | null>(null)

export function CategoryIdProvider({
  categoryId,
  children,
}: {
  categoryId: CategoryId
  children: ReactNode
}) {
  return (
    <CategoryIdContext.Provider value={categoryId}>
      {children}
    </CategoryIdContext.Provider>
  )
}
