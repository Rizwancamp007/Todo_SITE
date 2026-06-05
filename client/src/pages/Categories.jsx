import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Check, FolderHeart } from 'lucide-react'
import toast from 'react-hot-toast'
import useCategoryStore from '../store/useCategoryStore'
import useTodoStore from '../store/useTodoStore'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/priorityUtils'

export default function Categories() {
  const { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore()
  const { todos, fetchTodos } = useTodoStore()

  // Form states
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(CATEGORY_COLORS[0])
  const [icon, setIcon] = useState(CATEGORY_ICONS[0])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchTodos()
  }, [])

  // Calculate todo counts per category
  function getTaskStats(catId) {
    const catTodos = todos.filter((t) => (t.category?._id || t.category) === catId)
    const completed = catTodos.filter((t) => t.status === 'completed').length
    const total = catTodos.length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, rate }
  }

  function openCreate() {
    setEditingId(null)
    setName('')
    setColor(CATEGORY_COLORS[0])
    setIcon(CATEGORY_ICONS[0])
    setModalOpen(true)
  }

  function openEdit(cat) {
    setEditingId(cat._id)
    setName(cat.name)
    setColor(cat.color)
    setIcon(cat.icon)
    setModalOpen(true)
  }

  async function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this category? Tasks belonging to it will lose their category association.')) {
      try {
        await deleteCategory(id)
        toast.success('Category deleted')
        fetchTodos() // refresh todo list category references
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Category name is required')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        await updateCategory(editingId, { name, color, icon })
        toast.success('Category updated')
      } else {
        await createCategory({ name, color, icon })
        toast.success('Category created')
      }
      setModalOpen(false)
      fetchTodos() // refresh todo list category fields
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title page-title-gradient">Manage Categories</h1>
            <div className="page-subtitle">Group and organize your tasks using folders, emojis, and colors.</div>
          </div>
          <button className="btn btn-primary" onClick={openCreate} id="create-category-btn">
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </div>

      {isLoading && categories.length === 0 ? (
        <div className="category-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: '180px' }} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state page-enter">
          <div className="empty-icon">📁</div>
          <div className="empty-title">No categories yet</div>
          <div className="empty-desc">Create categories like Personal, Work, or Fitness to keep your dashboard clean.</div>
        </div>
      ) : (
        <div className="category-grid">
          {categories.map((cat) => {
            const stats = getTaskStats(cat._id)
            return (
              <div
                key={cat._id}
                className="category-card page-enter"
                style={{ '--category-color': cat.color }}
              >
                {/* Visual Category accent line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: cat.color }} />

                <div className="category-card-header">
                  <div className="category-icon-wrap" style={{ color: cat.color, borderColor: cat.color + '40', background: cat.color + '15' }}>
                    {cat.icon}
                  </div>
                  <div className="category-card-actions">
                    <button className="todo-action-btn edit" onClick={() => openEdit(cat)} title="Edit Category">
                      <Pencil size={12} />
                    </button>
                    <button className="todo-action-btn delete" onClick={() => handleDelete(cat._id)} title="Delete Category">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="category-name">{cat.name}</div>
                <div className="category-count">{stats.total} Tasks</div>

                {/* Progress bar */}
                <div className="category-progress">
                  <div className="category-progress-label">
                    <span>Completion Rate</span>
                    <span style={{ color: cat.color, fontWeight: 600 }}>{stats.rate}%</span>
                  </div>
                  <div className="category-progress-track">
                    <div
                      className="category-progress-fill"
                      style={{ width: `${stats.rate}%`, background: cat.color }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create/Edit Category Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label={editingId ? 'Edit Category' : 'Create Category'}>
            <div className="modal-header">
              <div className="modal-title">
                <FolderHeart size={18} className="text-purple" />
                {editingId ? 'Edit Category' : 'Create Category'}
              </div>
              <button className="modal-close" onClick={() => setModalOpen(false)} aria-label="Close modal">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Category Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="cat-name">Category Name</label>
                  <input
                    id="cat-name"
                    className="form-input"
                    placeholder="e.g. Work, Health, Reading"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    autoFocus
                  />
                </div>

                {/* Color swatch picker */}
                <div className="form-group">
                  <label className="form-label">Accent Color</label>
                  <div className="color-picker-row">
                    {CATEGORY_COLORS.map((c) => (
                      <div
                        key={c}
                        className={`color-swatch ${color === c ? 'selected' : ''}`}
                        style={{ background: c }}
                        onClick={() => setColor(c)}
                      />
                    ))}
                  </div>
                </div>

                {/* Icon emoji selector */}
                <div className="form-group">
                  <label className="form-label">Emoji Icon</label>
                  <div className="icon-picker-row">
                    {CATEGORY_ICONS.map((i) => (
                      <div
                        key={i}
                        className={`icon-swatch ${icon === i ? 'selected' : ''}`}
                        onClick={() => setIcon(i)}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving} id="save-category-btn">
                  {saving ? 'Saving…' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
