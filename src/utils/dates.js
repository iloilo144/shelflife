const DAY = 86400000

export function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(days, from = startOfToday()) {
  const d = new Date(from)
  d.setDate(d.getDate() + days)
  return d
}

/** yyyy-mm-dd in local time */
export function toISODate(date) {
  const d = new Date(date)
  const pad = (v) => String(v).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysLeft(item) {
  return Math.round((parseDate(item.expiresAt) - startOfToday()) / DAY)
}

/** 0–1: how much of the item's shelf life remains */
export function freshness(item) {
  const total = Math.max(1, Math.round((parseDate(item.expiresAt) - parseDate(item.addedAt)) / DAY))
  return Math.min(1, Math.max(0, daysLeft(item) / total))
}

export function urgency(item) {
  const d = daysLeft(item)
  if (d < 0) return 'expired'
  if (d <= 1) return 'urgent'
  if (d <= 3) return 'soon'
  return 'fine'
}

export function dueLabel(item) {
  const d = daysLeft(item)
  if (d < -1) return `${Math.abs(d)} days past its date`
  if (d === -1) return 'Past its date since yesterday'
  if (d === 0) return 'Use today'
  if (d === 1) return 'Use by tomorrow'
  if (d <= 14) return `${d} days left`
  if (d <= 60) return `${Math.round(d / 7)} weeks left`
  return `${Math.round(d / 30)} months left`
}

export function shortDate(iso) {
  return parseDate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
