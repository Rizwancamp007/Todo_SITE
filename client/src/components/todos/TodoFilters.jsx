import { List, Kanban, RotateCcw } from 'lucide-react'
import useTodoStore from '../../store/useTodoStore'
import useCategoryStore from '../../store/useCategoryStore'
import { PRIORITIES, STATUSES } from '../../utils/priorityUtils'

export default function TodoFilters({ view, onViewChange }) {
  const { filters, sort, setFilter, setSort, clearFilters } = useTodoStore()
  const { categories } = useCategoryStore()

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.search !== ''

  return (
    <div className="filter-bar page-enter">
      <div className="filter-group">
        {/* Status filters */}
        <div className="flex items-center gap-2">
          <span className="filter-label">Status</span>
          <button
            className={`filter-pill ${filters.status === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('status', 'all')}
          >
            All
          </button>
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`filter-pill ${filters.status === status ? 'active' : ''}`}
              onClick={() => setFilter('status', status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="filter-divider" />

        {/* Priority filters */}
        <div className="flex items-center gap-2">
          <span className="filter-label">Priority</span>
          <button
            className={`filter-pill ${filters.priority === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('priority', 'all')}
          >
            All
          </button>
          {PRIORITIES.map((prio) => (
            <button
              key={prio}
              className={`filter-pill ${filters.priority === prio ? 'active' : ''}`}
              onClick={() => setFilter('priority', prio)}
            >
              {prio.charAt(0).toUpperCase() + prio.slice(1)}
            </button>
          ))}
        </div>

        <div className="filter-divider" />

        {/* Category filters */}
        <div className="flex items-center gap-2">
          <span className="filter-label">Category</span>
          <select
            className="filter-sort-select"
            value={filters.category}
            onChange={(e) => setFilter('category', e.target.value)}
            style={{ borderRadius: 'var(--radius-full)', background: 'var(--glass-bg)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Sort select */}
        <div className="flex items-center gap-2">
          <span className="filter-label">Sort By</span>
          <select
            className="filter-sort-select"
            value={`${sort.field}-${sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSort(field, order)
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="deadline-asc">Nearest Deadline</option>
            <option value="deadline-desc">Farthest Deadline</option>
            <option value="priority-desc">High Priority First</option>
          </select>
        </div>

        {/* Reset filters */}
        {hasActiveFilters && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={clearFilters}
            style={{ gap: '4px', borderRadius: 'var(--radius-full)', padding: '5px 12px' }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}

        <div className="filter-divider" />

        {/* View toggles */}
        <div className="view-toggle">
          <button
            className={`view-toggle-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => onViewChange('list')}
            title="List view"
          >
            <List size={16} />
          </button>
          <button
            className={`view-toggle-btn ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => onViewChange('kanban')}
            title="Kanban Board view"
          >
            <Kanban size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
