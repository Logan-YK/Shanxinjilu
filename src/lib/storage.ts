import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { CategoryId, DayCategories, Entry } from '../types'

interface ShanxinDB extends DBSchema {
  days: {
    key: string
    value: DayCategories
  }
}

const DB_NAME = 'shanxin-ledger'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<ShanxinDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<ShanxinDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('days')
      },
    })
  }
  return dbPromise
}

export async function getDay(date: string): Promise<DayCategories> {
  const db = await getDb()
  const data = await db.get('days', date)
  return data ?? {}
}

async function saveDay(date: string, data: DayCategories): Promise<void> {
  const db = await getDb()
  const hasAny = Object.values(data).some((arr) => arr && arr.length > 0)
  if (!hasAny) {
    await db.delete('days', date)
    return
  }
  await db.put('days', data, date)
}

export async function addEntry(
  date: string,
  categoryId: CategoryId,
  entry: Entry,
): Promise<DayCategories> {
  const data = await getDay(date)
  const list = [...(data[categoryId] ?? []), entry]
  const next = { ...data, [categoryId]: list }
  await saveDay(date, next)
  return next
}

export async function updateEntry(
  date: string,
  categoryId: CategoryId,
  entryId: string,
  amount: number,
): Promise<DayCategories> {
  const data = await getDay(date)
  const list = (data[categoryId] ?? []).map((e) =>
    e.id === entryId ? { ...e, amount } : e,
  )
  const next = { ...data, [categoryId]: list }
  await saveDay(date, next)
  return next
}

export async function deleteEntry(
  date: string,
  categoryId: CategoryId,
  entryId: string,
): Promise<DayCategories> {
  const data = await getDay(date)
  const list = (data[categoryId] ?? []).filter((e) => e.id !== entryId)
  const next = { ...data }
  if (list.length === 0) {
    delete next[categoryId]
  } else {
    next[categoryId] = list
  }
  await saveDay(date, next)
  return next
}

export function newEntryId(): string {
  return crypto.randomUUID()
}
