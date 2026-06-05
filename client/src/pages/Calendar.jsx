import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react'
import useTodoStore from '../store/useTodoStore'
import { getCalendarDays, formatDate } from '../utils/dateUtils'
import { getPriorityConfig } from '../utils/priorityUtils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const { todos, fetchTodos } = useTodoStore()
  const { openEdit } = useOutletContext()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchTodos()
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const days = getCalendarDays(year, month)
  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Filter tasks that fall on a specific calendar day
  function getTodosForDay(date) {
    return todos.filter((todo) => {
      if (!todo.deadline) return false
      const dead = new Date(todo.deadline)
      return (
        dead.getDate() === date.getDate() &&
        dead.getMonth() === date.getMonth() &&
        dead.getFullYear() === date.getFullYear()
      )
    })
  }

  return (
    <div className="card-glass page-enter">
      {/* Calendar Header Navigation */}
      <div className="calendar-nav">
        <h2 className="calendar-nav-title text-primary">
          {monthName} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{year}</span>
        </h2>
        <div className="calendar-nav-btns">
          <button className="header-icon-btn" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button className="header-icon-btn" onClick={nextMonth} aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="calendar-grid" style={{ marginBottom: 8 }}>
        {WEEKDAYS.map((day) => (
          <div key={day} className="calendar-header-cell">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="calendar-grid">
        {days.map(({ date, isCurrentMonth }, index) => {
          const dayTodos = getTodosForDay(date)
          const isTodayDate =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear()

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isTodayDate ? 'today' : ''}`}
              title={dayTodos.length > 0 ? `${dayTodos.length} Tasks` : 'No tasks'}
            >
              <span className="calendar-day-num">{date.getDate()}</span>

              {/* Todos on this day */}
              <div className="calendar-day-dots">
                {dayTodos.map((todo) => {
                  const prio = getPriorityConfig(todo.priority)
                  return (
                    <div
                      key={todo._id}
                      className="calendar-dot"
                      style={{
                        background: prio.color,
                        boxShadow: `0 0 6px ${prio.color}`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        openEdit(todo)
                      }}
                      title={`${todo.title} (${todo.priority})`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer priority reference list */}
      <div className="flex justify-center items-center gap-4 mt-6 border-t-subtle" style={{ paddingTop: '16px' }}>
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Priority Legend:</span>
        <div className="flex items-center gap-1">
          <div className="calendar-dot" style={{ background: 'var(--priority-high)' }} />
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="calendar-dot" style={{ background: 'var(--priority-medium)' }} />
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="calendar-dot" style={{ background: 'var(--priority-low)' }} />
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Low</span>
        </div>
      </div>
    </div>
  )
}
