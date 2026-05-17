export function todayIso(): string {
  const d = new Date()
  return formatDateIso(d)
}

export function formatDateIso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDisplayDate(iso: string): string {
  const d = parseIsoDate(iso)
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${iso} 周${weekdays[d.getDay()]}`
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${min}`
}

export function formatAmount(n: number): string {
  return n.toFixed(2)
}
