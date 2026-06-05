import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import TodoForm from '../todos/TodoForm'
import useTodoStore from '../../store/useTodoStore'
import useCategoryStore from '../../store/useCategoryStore'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formOpen, setFormOpen]       = useState(false)
  const [editTodo, setEditTodo]       = useState(null)

  const { fetchTodos, fetchStats } = useTodoStore()
  const { fetchCategories }        = useCategoryStore()

  useEffect(() => {
    fetchTodos()
    fetchStats()
    fetchCategories()
  }, [])

  function openAdd()       { setEditTodo(null); setFormOpen(true) }
  function openEdit(todo)  { setEditTodo(todo); setFormOpen(true) }
  function closeForm()     { setFormOpen(false); setEditTodo(null) }

  return (
    <div className="app-layout">
      {/* Animated background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onAddClick={openAdd}
        />

        <main className="app-content">
          {/* Pass openEdit down via context-like prop on Outlet */}
          <Outlet context={{ openEdit }} />
        </main>
      </div>

      {/* Global Todo Form Modal */}
      {formOpen && (
        <TodoForm
          todo={editTodo}
          onClose={closeForm}
        />
      )}
    </div>
  )
}
