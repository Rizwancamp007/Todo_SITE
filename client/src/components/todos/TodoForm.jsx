import { useState, useEffect } from 'react'
import { X, Plus, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import useTodoStore from '../../store/useTodoStore'
import useCategoryStore from '../../store/useCategoryStore'
import { toInputDate } from '../../utils/dateUtils'
import { PRIORITY_CONFIG } from '../../utils/priorityUtils'

export default function TodoForm({ todo, onClose }) {
  const { createTodo, updateTodo } = useTodoStore()
  const { categories } = useCategoryStore()
  const isEdit = Boolean(todo)

  const [form, setForm] = useState({
    title:       todo?.title       || '',
    description: todo?.description || '',
    priority:    todo?.priority    || 'medium',
    category:    todo?.category?._id || todo?.category || '',
    deadline:    todo?.deadline ? toInputDate(todo.deadline) : '',
    tags:        todo?.tags        || [],
    status:      todo?.status      || 'pending',
  })
  const [tagInput, setTagInput]   = useState('')
  const [saving, setSaving]       = useState(false)
  const [errors, setErrors]       = useState({})

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (form.title.length > 200) e.title = 'Max 200 characters'
    return e
  }

  function addTag(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().replace(',', '')
      if (!form.tags.includes(t) && form.tags.length < 8) {
        setForm(f => ({ ...f, tags: [...f.tags, t] }))
      }
      setTagInput('')
    }
  }

  function removeTag(t) { setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) })) }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      const payload = {
        ...form,
        category: form.category || null,
        deadline: form.deadline || null,
      }
      if (isEdit) {
        await updateTodo(todo._id, payload)
        toast.success('Task updated!')
      } else {
        await createTodo(payload)
        toast.success('Task created!')
      }
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit Task' : 'New Task'}>
        <div className="modal-header">
          <div className="modal-title">
            <span>{isEdit ? '✏️' : '✨'}</span>
            {isEdit ? 'Edit Task' : 'New Task'}
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="todo-title">
                Title <span className="form-label-required">*</span>
              </label>
              <input
                id="todo-title"
                className="form-input"
                placeholder="What needs to be done?"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                autoFocus
                maxLength={200}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {errors.title && <span className="form-error">⚠ {errors.title}</span>}
                <span className="form-char-count" style={{ marginLeft: 'auto' }}>{form.title.length}/200</span>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="todo-desc">Description</label>
              <textarea
                id="todo-desc"
                className="form-input form-textarea"
                placeholder="Add more details…"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                maxLength={1000}
              />
              <span className="form-char-count">{form.description.length}/1000</span>
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="priority-picker">
                {['high', 'medium', 'low'].map((p) => (
                  <label key={p} className="priority-option">
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={form.priority === p}
                      onChange={() => set('priority', p)}
                    />
                    <span className={`priority-option-label ${p}`}>
                      {PRIORITY_CONFIG[p].emoji} {PRIORITY_CONFIG[p].label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status (edit only) */}
            {isEdit && (
              <div className="form-group">
                <label className="form-label" htmlFor="todo-status">Status</label>
                <select
                  id="todo-status"
                  className="form-select"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            )}

            {/* Category + Deadline in a row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="todo-category">Category</label>
                <select
                  id="todo-category"
                  className="form-select"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="todo-deadline">Deadline</label>
                <input
                  id="todo-deadline"
                  type="datetime-local"
                  className="form-input"
                  value={form.deadline}
                  onChange={(e) => set('deadline', e.target.value)}
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tags-input-container">
                {form.tags.map((t) => (
                  <span key={t} className="tag-removable">
                    {t}
                    <button type="button" className="tag-remove-btn" onClick={() => removeTag(t)}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input
                  className="tags-input-field"
                  placeholder={form.tags.length < 8 ? 'Type & press Enter…' : 'Max 8 tags'}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  disabled={form.tags.length >= 8}
                />
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving} id="save-task-btn">
              {saving ? (
                <><span className="spin" style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} /> Saving…</>
              ) : (
                <><Check size={15} /> {isEdit ? 'Update Task' : 'Create Task'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
