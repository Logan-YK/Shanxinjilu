export type CategoryId =
  | 'gongyang'
  | 'changzhu'
  | 'jiansi'
  | 'gongseng'
  | 'qita'
  | 'fangsheng'

export interface Entry {
  id: string
  amount: number
  createdAt: string
}

export type DayCategories = Partial<Record<CategoryId, Entry[]>>

export interface CategoryDef {
  id: CategoryId
  label: string
  inTotal: boolean
}
