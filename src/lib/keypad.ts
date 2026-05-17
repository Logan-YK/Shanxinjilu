export function appendDigit(current: string, digit: string): string {
  if (digit === '.' && current.includes('.')) return current
  if (digit === '.' && current === '') return '0.'
  if (digit !== '.' && current === '0' && !current.includes('.')) {
    return digit
  }
  const next = current + digit
  return isValidAmountInput(next) ? next : current
}

export function backspaceInput(current: string): string {
  return current.slice(0, -1)
}

export function isValidAmountInput(value: string): boolean {
  if (value === '' || value === '.') return true
  if (!/^\d*\.?\d{0,2}$/.test(value)) return false
  if (value.length > 12) return false
  return true
}

export function parseAmountInput(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '.') return null
  const n = parseFloat(trimmed)
  if (Number.isNaN(n) || n <= 0) return null
  return Math.round(n * 100) / 100
}
