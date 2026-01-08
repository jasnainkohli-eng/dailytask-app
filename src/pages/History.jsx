import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Header } from '../components/Layout/Header'
import './Pages.css'

export function History() {
  const { user } = useAuth()
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')

  useEffect(() => {
    if (user) {
      fetchHistory()
    }
  }, [user])

  const fetchHistory = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group tasks by date
      const grouped = data.reduce((acc, task) => {
        const date = task.date
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(task)
        return acc
      }, {})

      // Convert to array and sort by date (newest first)
      const sortedDates = Object.keys(grouped).sort(
        (a, b) => new Date(b) - new Date(a)
      )

      setHistoryData(
        sortedDates.map((date) => ({
          date,
          tasks: grouped[date],
        }))
      )
    } catch (err) {
      console.error('Error fetching history:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today'
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  const getCompletedCount = (tasks) => {
    return tasks.filter((t) => t.completed).length
  }

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <div className="history-container">
          <h2>Task History</h2>

          {loading ? (
            <div className="loading-state">Loading history...</div>
          ) : historyData.length === 0 ? (
            <div className="empty-state">
              <p>No task history yet. Start adding tasks to see them here!</p>
            </div>
          ) : (
            <div className="history-list">
              {historyData.map(({ date, tasks }) => (
                <div key={date} className="history-day">
                  <div className="history-day-header">
                    <h3>{formatDate(date)}</h3>
                    <span className="history-day-count">
                      {getCompletedCount(tasks)} / {tasks.length} completed
                    </span>
                  </div>
                  <div className="history-tasks">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`history-task-item ${
                          task.completed ? 'completed' : ''
                        }`}
                      >
                        <span className="history-task-check">
                          {task.completed ? '✓' : '○'}
                        </span>
                        <span className="history-task-text">{task.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

