import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Calendar, Tag, Zap } from 'lucide-react'
import useTodoStore from '../../store/useTodoStore'

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',  Icon: LayoutDashboard },
  { to: '/tasks',      label: 'Tasks',       Icon: CheckSquare },
  { to: '/calendar',   label: 'Calendar',    Icon: Calendar },
  { to: '/categories', label: 'Categories',  Icon: Tag },
]

export default function Sidebar({ isOpen, onClose }) {
  const { todos, stats } = useTodoStore()
  const pending   = todos.filter(t => t.status === 'pending').length
  const total     = stats?.total || 0
  const completed = stats?.completed || 0
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <>
      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Top accent line */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src="/public/logo.png" alt="TaskFlow Logo" />
          </div>
          <span className="sidebar-logo-text">TaskFlow</span>
          <span className="sidebar-logo-badge">v1.0</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-label">Navigation</div>
          <nav className="sidebar-nav">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-link-icon">
                  <Icon size={18} />
                </span>
                <span className="sidebar-link-label">{label}</span>
                {label === 'Tasks' && pending > 0 && (
                  <span className="sidebar-link-badge">{pending}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-divider" />

          <div className="sidebar-section-label">Quick Stats</div>
          <div className="sidebar-stats">
            <div className="sidebar-stat-row">
              <span className="sidebar-stat-label">Completion</span>
              <span className="sidebar-stat-value">{pct}%</span>
            </div>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="sidebar-stat-row" style={{ marginTop: 6 }}>
              <span className="sidebar-stat-label">Total Tasks</span>
              <span className="sidebar-stat-value">{total}</span>
            </div>
            <div className="sidebar-stat-row">
              <span className="sidebar-stat-label">Completed</span>
              <span className="sidebar-stat-value" style={{ color: 'var(--priority-low)' }}>{completed}</span>
            </div>
            {stats?.overdue > 0 && (
              <div className="sidebar-stat-row">
                <span className="sidebar-stat-label">Overdue</span>
                <span className="sidebar-stat-value" style={{ color: 'var(--priority-high)' }}>{stats.overdue}</span>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--priority-low)', boxShadow: '0 0 6px var(--priority-low)' }} />
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>System Online</span>
            <Zap size={12} style={{ color: 'var(--accent-cyan)', marginLeft: 'auto' }} />
          </div>
        </div>
      </aside>
    </>
  )
}
