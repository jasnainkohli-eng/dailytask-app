import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { TaskList } from '../components/Task/TaskList'
import { DailyQuote } from '../components/Quote/DailyQuote'
import { Greeting } from '../components/Greeting/Greeting'
import { Header } from '../components/Layout/Header'
import './Pages.css'

export function Home() {
  const { user } = useAuth()
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks(user?.id)

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        <Greeting />
        <DailyQuote />
        <TaskList
          tasks={tasks}
          loading={loading}
          onAddTask={addTask}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </div>
    </div>
  )
}

