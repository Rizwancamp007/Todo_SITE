import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ListFilter } from 'lucide-react'
import useTodoStore from '../store/useTodoStore'
import TodoFilters from '../components/todos/TodoFilters'
import TodoList from '../components/todos/TodoList'

export default function Tasks() {
  const { todos, isLoading, fetchTodos, filters } = useTodoStore()
  const { openEdit } = useOutletContext()
  const [view, setView] = useState('list')

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="page-enter">
      {/* Filters Bar */}
      <TodoFilters view={view} onViewChange={setView} />

      {/* Main Todo listing */}
      {isLoading ? (
        <div className="flex-col gap-4 w-full page-enter">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '90px', borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : (
        <TodoList todos={todos} view={view} onEdit={openEdit} />
      )}
    </div>
  )
}
