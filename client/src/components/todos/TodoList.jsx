import TodoCard from './TodoCard'
import { getStatusConfig } from '../../utils/priorityUtils'

export default function TodoList({ todos, view = 'list', onEdit }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state page-enter">
        <div className="empty-icon">🏖️</div>
        <div className="empty-title">All caught up!</div>
        <div className="empty-desc">No tasks matched your current filter criteria. Create a new task or modify filters to get started.</div>
      </div>
    )
  }

  if (view === 'kanban') {
    const columns = {
      pending: todos.filter((t) => t.status === 'pending'),
      'in-progress': todos.filter((t) => t.status === 'in-progress'),
      completed: todos.filter((t) => t.status === 'completed'),
    }

    return (
      <div className="kanban-board page-enter">
        {Object.entries(columns).map(([status, items]) => {
          const config = getStatusConfig(status)
          return (
            <div key={status} className="kanban-column">
              <div className="kanban-header">
                <div className="kanban-title" style={{ color: config.kanbanColor }}>
                  <span>{config.emoji}</span>
                  {config.label}
                </div>
                <span className="kanban-count">{items.length}</span>
              </div>
              <div className="kanban-body">
                {items.length === 0 ? (
                  <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>
                    Drop tasks here
                  </div>
                ) : (
                  items.map((todo) => (
                    <TodoCard key={todo._id} todo={todo} onEdit={onEdit} compact />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="todo-list page-enter">
      {todos.map((todo) => (
        <TodoCard key={todo._id} todo={todo} onEdit={onEdit} />
      ))}
    </div>
  )
}
