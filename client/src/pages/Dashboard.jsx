import { useEffect } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { CheckCircle2, PlayCircle, AlertCircle, ListTodo, Calendar, ArrowRight } from 'lucide-react'
import useTodoStore from '../store/useTodoStore'
import StatsCard from '../components/dashboard/StatsCard'
import ProgressRing from '../components/dashboard/ProgressRing'
import { formatDate, getDeadlineInfo } from '../utils/dateUtils'

export default function Dashboard() {
  const { stats, fetchStats, isStatsLoading } = useTodoStore()
  const { openEdit } = useOutletContext()

  useEffect(() => {
    fetchStats()
  }, [])

  if (isStatsLoading && !stats) {
    return (
      <div className="flex-col gap-6 w-full page-enter">
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
        <div className="skeleton" style={{ height: '140px', borderRadius: 'var(--radius-xl)' }} />
      </div>
    )
  }

  const {
    total = 0,
    completed = 0,
    inProgress = 0,
    pending = 0,
    overdue = 0,
    completionRate = 0,
    upcoming = [],
    recent = [],
    priorityBreakdown = [],
  } = stats || {}

  // Parse priority counts
  const highVal = priorityBreakdown.find((p) => p._id === 'high')?.count || 0
  const medVal  = priorityBreakdown.find((p) => p._id === 'medium')?.count || 0
  const lowVal  = priorityBreakdown.find((p) => p._id === 'low')?.count || 0
  const activeTotal = highVal + medVal + lowVal

  // Get priority percentages
  const highPct = activeTotal > 0 ? Math.round((highVal / activeTotal) * 100) : 0
  const medPct  = activeTotal > 0 ? Math.round((medVal / activeTotal) * 100) : 0
  const lowPct  = activeTotal > 0 ? Math.round((lowVal / activeTotal) * 100) : 0

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title page-title-gradient">Good Day!</h1>
            <div className="page-subtitle">Here is what is happening with your tasks today.</div>
          </div>
          <Link to="/tasks" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            View All Tasks
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Stats overview cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Tasks"
          value={total}
          icon={<ListTodo size={22} />}
          colorClass="purple"
        />
        <StatsCard
          title="In Progress"
          value={inProgress}
          icon={<PlayCircle size={22} />}
          colorClass="blue"
        />
        <StatsCard
          title="Completed"
          value={completed}
          icon={<CheckCircle2 size={22} />}
          colorClass="green"
        />
        <StatsCard
          title="Overdue Items"
          value={overdue}
          icon={<AlertCircle size={22} />}
          colorClass="red"
          trend={overdue > 0 ? `${overdue} Urgent` : undefined}
          trendType="down"
        />
      </div>

      {/* Completion rates */}
      <ProgressRing
        percentage={completionRate}
        title="Your Daily Progress Rate"
        description="Great work! You have finished a significant portion of your recent tasks. Keep going to clear your backlog."
      />

      <div className="dashboard-grid">
        {/* Upcoming deadlines panel */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-dot" />
              Upcoming Deadlines
            </h2>
            <Link to="/calendar" className="btn btn-ghost btn-sm" style={{ gap: '4px' }}>
              <Calendar size={12} />
              Calendar
            </Link>
          </div>

          <div className="upcoming-list">
            {upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                🎉 No upcoming deadlines for the next 7 days!
              </div>
            ) : (
              upcoming.map((todo) => {
                const info = getDeadlineInfo(todo.deadline)
                return (
                  <div key={todo._id} className="upcoming-item cursor-pointer" onClick={() => openEdit(todo)}>
                    <div
                      className="upcoming-item-dot"
                      style={{
                        background:
                          todo.priority === 'high'
                            ? 'var(--priority-high)'
                            : todo.priority === 'medium'
                            ? 'var(--priority-medium)'
                            : 'var(--priority-low)',
                      }}
                    />
                    <div className="upcoming-item-info">
                      <div className="upcoming-item-title">{todo.title}</div>
                      <div className="upcoming-item-date">
                        {formatDate(todo.deadline, 'eee, MMM d h:mm a')} ({info?.relative})
                      </div>
                    </div>
                    {todo.category && (
                      <span
                        className="chip"
                        style={{
                          color: todo.category.color,
                          borderColor: todo.category.color + '30',
                          background: todo.category.color + '10',
                        }}
                      >
                        {todo.category.name}
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Priority breakdown & Recent Activity */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-dot" />
              Active Priority Share
            </h2>
          </div>

          <div className="priority-bars">
            <div className="priority-bar-row">
              <span className="priority-bar-label">High</span>
              <div className="priority-bar-track">
                <div className="priority-bar-fill high" style={{ width: `${highPct}%` }} />
              </div>
              <span className="priority-bar-count">{highVal}</span>
            </div>

            <div className="priority-bar-row">
              <span className="priority-bar-label">Medium</span>
              <div className="priority-bar-track">
                <div className="priority-bar-fill medium" style={{ width: `${medPct}%` }} />
              </div>
              <span className="priority-bar-count">{medVal}</span>
            </div>

            <div className="priority-bar-row">
              <span className="priority-bar-label">Low</span>
              <div className="priority-bar-track">
                <div className="priority-bar-fill low" style={{ width: `${lowPct}%` }} />
              </div>
              <span className="priority-bar-count">{lowVal}</span>
            </div>
          </div>

          <div className="divider" style={{ margin: '24px 0' }} />

          <div className="section-header" style={{ marginBottom: 12 }}>
            <h2 className="section-title" style={{ fontSize: 'var(--font-base)' }}>
              Recent Activities
            </h2>
          </div>

          <div className="flex-col gap-2">
            {recent.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>
                No recent activity recorded.
              </div>
            ) : (
              recent.slice(0, 3).map((todo) => (
                <div
                  key={todo._id}
                  className="flex justify-between items-center cursor-pointer"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255,255,255,0.02)',
                    fontSize: 'var(--font-sm)',
                  }}
                  onClick={() => openEdit(todo)}
                >
                  <span className="truncate text-secondary" style={{ maxWidth: '70%', textDecoration: todo.status === 'completed' ? 'line-through' : 'none' }}>
                    {todo.title}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Updated {formatDate(todo.updatedAt, 'MMM d, h:mm a')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
