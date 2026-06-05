import { useState } from 'react'
import { Pencil, Trash2, Check, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import useTodoStore from '../../store/useTodoStore'
import { getDeadlineInfo } from '../../utils/dateUtils'
import { getPriorityConfig, getStatusConfig, getNextStatus } from '../../utils/priorityUtils'

export default function TodoCard({ todo, onEdit, compact = false }) {
  const { toggleStatus, deleteTodo } = useTodoStore()
  const [deleting, setDeleting]      = useState(false)

  const priorityCfg = getPriorityConfig(todo.priority)
  const deadlineInfo = getDeadlineInfo(todo.deadline)
  const isCompleted  = todo.status === 'completed'

  async function handleToggle() {
    const next = getNextStatus(todo.status)
    try {
      await toggleStatus(todo._id, next)
      if (next === 'completed') toast.success('Task completed! 🎉')
    } catch { toast.error('Failed to update') }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteTodo(todo._id)
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete')
      setDeleting(false)
    }
  }

  return (
    <div className={`todo-card priority-${todo.priority} ${isCompleted ? 'completed-card' : ''}`}>
      <div className="todo-card-header">
        <div className="todo-card-left">
          {/* Checkbox */}
          <button
            className={`todo-checkbox ${isCompleted ? 'checked' : ''}`}
            onClick={handleToggle}
            title="Toggle status"
            aria-label={`Mark as ${getNextStatus(todo.status)}`}
          >
            {isCompleted && <Check size={12} strokeWidth={3} color="white" />}
          </button>

          <div className="todo-card-info">
            <div className="todo-title">{todo.title}</div>
            {todo.description && !compact && (
              <div className="todo-description">{todo.description}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="todo-card-actions">
          <button className="todo-action-btn edit" onClick={() => onEdit(todo)} title="Edit" aria-label="Edit task">
            <Pencil size={13} />
          </button>
          <button
            className="todo-action-btn delete"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
            aria-label="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="todo-card-footer">
        {/* Priority badge */}
        <span className={`badge ${priorityCfg.badgeClass}`}>
          <span className="badge-dot" style={{ background: priorityCfg.color }} />
          {priorityCfg.label}
        </span>

        {/* Status badge */}
        <span className={`badge ${getStatusConfig(todo.status).badgeClass}`}>
          {getStatusConfig(todo.status).label}
        </span>

        {/* Category chip */}
        {todo.category && (
          <span
            className="chip"
            style={{
              color: todo.category.color,
              borderColor: todo.category.color + '40',
              background: todo.category.color + '18',
            }}
          >
            {todo.category.icon} {todo.category.name}
          </span>
        )}

        {/* Deadline */}
        {deadlineInfo && (
          <span className={`todo-deadline ${deadlineInfo.cls}`}>
            <Clock size={10} />
            {deadlineInfo.label}
          </span>
        )}

        {/* Tags */}
        {todo.tags?.length > 0 && !compact && (
          <div className="todo-tags">
            {todo.tags.slice(0, 3).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
            {todo.tags.length > 3 && (
              <span className="tag">+{todo.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
