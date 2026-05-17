import { appendDigit, backspaceInput } from '../lib/keypad'

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
] as const

interface KeypadProps {
  value: string
  onChange: (value: string) => void
  onConfirm: () => void
  confirmLabel?: string
  confirmDisabled?: boolean
}

export function Keypad({
  value,
  onChange,
  onConfirm,
  confirmLabel = '确认',
  confirmDisabled = false,
}: KeypadProps) {
  const handleKey = (key: string) => {
    if (key === '⌫') {
      onChange(backspaceInput(value))
    } else {
      onChange(appendDigit(value, key))
    }
  }

  return (
    <div className="keypad-block">
      <div className="keypad-display-row">
        <div className="keypad-display" aria-live="polite">
          {value || '0'}
        </div>
        <button
          type="button"
          className="btn btn-primary keypad-confirm"
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          {confirmLabel}
        </button>
      </div>
      <div className="keypad-grid">
        {KEYS.flat().map((key) => (
          <button
            key={key}
            type="button"
            className={`keypad-key ${key === '⌫' ? 'keypad-key-muted' : ''}`}
            onClick={() => handleKey(key)}
            aria-label={key === '⌫' ? '删除' : key}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}
