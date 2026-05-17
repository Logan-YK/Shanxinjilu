import { useEffect } from 'react'

export function Toast({
  message,
  onDone,
}: {
  message: string | null
  onDone: () => void
}) {
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [message, onDone])

  if (!message) return null

  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}
