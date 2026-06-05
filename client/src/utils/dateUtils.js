import { formatDistanceToNow, format, isAfter, isBefore, addDays, isToday, isTomorrow } from 'date-fns'

/**
 * Returns deadline status class and label
 */
export function getDeadlineInfo(deadline) {
  if (!deadline) return null
  const date = new Date(deadline)
  const now = new Date()

  if (isBefore(date, now)) {
    return { cls: 'overdue', label: 'Overdue', relative: formatDistanceToNow(date, { addSuffix: true }) }
  }
  if (isToday(date)) {
    return { cls: 'due-soon', label: 'Due today', relative: 'Today' }
  }
  if (isTomorrow(date)) {
    return { cls: 'due-soon', label: 'Due tomorrow', relative: 'Tomorrow' }
  }
  if (isBefore(date, addDays(now, 3))) {
    return { cls: 'due-soon', label: 'Due soon', relative: formatDistanceToNow(date, { addSuffix: true }) }
  }
  return { cls: 'on-time', label: format(date, 'MMM d'), relative: formatDistanceToNow(date, { addSuffix: true }) }
}

/**
 * Formats a date for display
 */
export function formatDate(date, fmt = 'MMM d, yyyy') {
  if (!date) return '—'
  return format(new Date(date), fmt)
}

/**
 * Formats a date for datetime-local input
 */
export function toInputDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Get days in a month grid for calendar
 */
export function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay  = new Date(year, month + 1, 0)
  const days = []

  // Pad start
  for (let i = 0; i < firstDay.getDay(); i++) {
    const d = new Date(year, month, -i)
    days.unshift({ date: d, isCurrentMonth: false })
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true })
  }

  // Pad end to 42 cells
  while (days.length < 42) {
    const last = days[days.length - 1].date
    days.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), isCurrentMonth: false })
  }

  return days
}

export function isDateToday(date) { return isToday(new Date(date)) }
