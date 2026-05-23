import type { CategoryDef, CategoryId } from './types'

export const DONATION_CATEGORY_IDS: CategoryId[] = [
  'gongyang',
  'changzhu',
  'jiansi',
  'gongseng',
  'qita',
  'gongzhai',
  'gonghua',
  'gongguo',
  'gongxiang',
  'fabao',
]

export const CATEGORIES: CategoryDef[] = [
  { id: 'gongyang', label: '供养师父', inTotal: true },
  { id: 'changzhu', label: '常住随用', inTotal: true },
  { id: 'jiansi', label: '建寺', inTotal: true },
  { id: 'gongseng', label: '供僧', inTotal: true },
  { id: 'qita', label: '其他', inTotal: true },
  { id: 'fangsheng', label: '放生', inTotal: false },
  { id: 'gongzhai', label: '供斋', inTotal: true },
  { id: 'gonghua', label: '供花', inTotal: true },
  { id: 'gongguo', label: '供果', inTotal: true },
  { id: 'gongxiang', label: '供香', inTotal: true },
  { id: 'fabao', label: '法宝流通', inTotal: true },
]

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryDef>

export const LAST_VIEWED_KEY = 'shanxin-lastViewedDate'
