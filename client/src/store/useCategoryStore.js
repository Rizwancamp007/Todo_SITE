import { create } from 'zustand'
import api from '../api/axios'

const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await api.get('/categories')
      set({ categories: res.data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  createCategory: async (data) => {
    const res = await api.post('/categories', data)
    set((state) => ({ categories: [res.data, ...state.categories] }))
    return res.data
  },

  updateCategory: async (id, data) => {
    const res = await api.put(`/categories/${id}`, data)
    set((state) => ({
      categories: state.categories.map((c) => (c._id === id ? res.data : c)),
    }))
    return res.data
  },

  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}`)
    set((state) => ({ categories: state.categories.filter((c) => c._id !== id) }))
  },

  getCategoryById: (id) => get().categories.find((c) => c._id === id),
}))

export default useCategoryStore
