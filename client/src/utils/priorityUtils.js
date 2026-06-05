export const PRIORITIES = ['high', 'medium', 'low']
export const STATUSES   = ['pending', 'in-progress', 'completed']

export const PRIORITY_CONFIG = {
  high:   { label: 'High',   emoji: '🔴', color: '#f43f5e', badgeClass: 'badge-high',   dotColor: '#f43f5e' },
  medium: { label: 'Medium', emoji: '🟡', color: '#f59e0b', badgeClass: 'badge-medium', dotColor: '#f59e0b' },
  low:    { label: 'Low',    emoji: '🟢', color: '#10b981', badgeClass: 'badge-low',    dotColor: '#10b981' },
}

export const STATUS_CONFIG = {
  'pending':     { label: 'Pending',     emoji: '⏳', badgeClass: 'badge-pending',    dotClass: 'status-dot pending',     kanbanColor: '#64748b' },
  'in-progress': { label: 'In Progress', emoji: '⚡', badgeClass: 'badge-inprogress', dotClass: 'status-dot in-progress', kanbanColor: '#3b82f6' },
  'completed':   { label: 'Completed',   emoji: '✅', badgeClass: 'badge-completed',  dotClass: 'status-dot completed',   kanbanColor: '#10b981' },
}

export function getPriorityConfig(priority) {
  return PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium
}

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.pending
}

export function getNextStatus(current) {
  const cycle = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' }
  return cycle[current] || 'pending'
}

export const CATEGORY_COLORS = [
  '#7c3aed','#3b82f6','#06b6d4','#10b981','#f59e0b',
  '#f43f5e','#8b5cf6','#ec4899','#14b8a6','#f97316',
]

export const CATEGORY_ICONS = ['📁','🏠','💼','📚','🎯','💡','🚀','❤️','🌟','🛒','💪','🎨','🔧','📝','🎵']
