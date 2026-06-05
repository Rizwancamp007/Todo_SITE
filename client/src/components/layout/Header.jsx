import { useLocation } from 'react-router-dom'
import { Bell, Menu, Search, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import useTodoStore from '../../store/useTodoStore'
import useDebounce from '../../hooks/useDebounce'

const PAGE_META = {
  '/dashboard':  { title: 'Dashboard',  subtitle: 'Your productivity overview' },
  '/tasks':      { title: 'Tasks',      subtitle: 'Manage your todos' },
  '/calendar':   { title: 'Calendar',   subtitle: 'Deadline view' },
  '/categories': { title: 'Categories', subtitle: 'Organize by category' },
}

export default function Header({ onMenuClick, onAddClick }) {
  const { pathname } = useLocation()
  const { setSearch, applySearch } = useTodoStore()
  const [searchVal, setSearchVal] = useState('')
  const [time, setTime] = useState(new Date())
  const debounced = useDebounce(searchVal, 350)

  const meta = PAGE_META[pathname] || { title: 'TaskFlow', subtitle: '' }

  useEffect(() => {
    setSearch(debounced)
    applySearch()
  }, [debounced])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const dateStr = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          <Menu size={18} />
        </button>

        <div>
          <div className="header-title">{meta.title}</div>
        </div>

        <span className="header-subtitle">{meta.subtitle}</span>

        {/* Search — only visible on /tasks */}
        {pathname === '/tasks' && (
          <div className="header-search">
            <Search size={14} className="header-search-icon" />
            <input
              id="global-search"
              className="header-search-input"
              placeholder="Search tasks…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="header-datetime">
          <span>{dateStr}</span>
          <span style={{ color: 'var(--border-strong)' }}>•</span>
          <span>{timeStr}</span>
        </div>

        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={16} />
          <span className="header-dot" />
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={onAddClick}
          id="add-task-btn"
          style={{ gap: 6 }}
        >
          <Plus size={15} />
          Add Task
        </button>

        <div className="header-avatar" title="User">TF</div>
      </div>
    </header>
  )
}
