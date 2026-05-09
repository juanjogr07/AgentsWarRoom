export function elapsed(iso: string | undefined): string {
  if (!iso) return 'unknown'
  const ts = new Date(iso).getTime()
  if (isNaN(ts)) return 'unknown'
  const secs = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (secs < 60) return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  return m > 0 ? `${h}h ${m}m ago` : `${h}h ago`
}
