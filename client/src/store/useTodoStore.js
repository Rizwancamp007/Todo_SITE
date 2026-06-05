import { create } from 'zustand'
import api from '../api/axios'

const useTodoStore = create((set, get) => ({
  todos: [],
  stats: null,
  isLoading: false,
  isStatsLoading: false,
  error: null,

  filters: { status: 'all', priority: 'all', category: 'all', search: '' },
  sort: { field: 'createdAt', order: 'desc' },

  // ── Fetch ──────────────────────────────────────────────────
  fetchTodos: async () => {
    set({ isLoading: true, error: null })
    try {
      const { filters, sort } = get()
      const params = new URLSearchParams()
      if (filters.status   !== 'all') params.append('status',   filters.status)
      if (filters.priority !== 'all') params.append('priority', filters.priority)
      if (filters.category !== 'all') params.append('category', filters.category)
      if (filters.search)              params.append('search',   filters.search)
      params.append('sort',  sort.field)
      params.append('order', sort.order)

      const res = await api.get(`/todos?${params.toString()}`)
      set({ todos: res.data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchStats: async () => {
    set({ isStatsLoading: true })
    try {
      const res = await api.get('/todos/stats')
      set({ stats: res.data, isStatsLoading: false })
    } catch {
      set({ isStatsLoading: false })
    }
  },

  // ── CRUD ───────────────────────────────────────────────────
  createTodo: async (data) => {
    const res = await api.post('/todos', data)
    set((state) => ({ todos: [res.data, ...state.todos] }))
    get().fetchStats()
    return res.data
  },

  updateTodo: async (id, data) => {
    const res = await api.put(`/todos/${id}`, data)
    set((state) => ({ todos: state.todos.map((t) => (t._id === id ? res.data : t)) }))
    get().fetchStats()
    return res.data
  },

  toggleStatus: async (id, status) => {
    // Optimistic update
    set((state) => ({
      todos: state.todos.map((t) => (t._id === id ? { ...t, status } : t)),
    }))
    try {
      const res = await api.patch(`/todos/${id}/status`, { status })
      set((state) => ({ todos: state.todos.map((t) => (t._id === id ? res.data : t)) }))
      get().fetchStats()
    } catch {
      get().fetchTodos() // rollback
    }
  },

  deleteTodo: async (id) => {
    // Optimistic remove
    set((state) => ({ todos: state.todos.filter((t) => t._id !== id) }))
    try {
      await api.delete(`/todos/${id}`)
      get().fetchStats()
    } catch {
      get().fetchTodos() // rollback
    }
  },

  // ── Filters & Sort ─────────────────────────────────────────
  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }))
    get().fetchTodos()
  },

  setSort: (field, order) => {
    set({ sort: { field, order } })
    get().fetchTodos()
  },

  clearFilters: () => {
    set({ filters: { status: 'all', priority: 'all', category: 'all', search: '' } })
    get().fetchTodos()
  },

  setSearch: (search) => {
    set((state) => ({ filters: { ...state.filters, search } }))
  },

  applySearch: () => get().fetchTodos(),
}))

export default useTodoStore
