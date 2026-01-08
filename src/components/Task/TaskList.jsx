import { AddTask } from './AddTask'
import { TaskItem } from './TaskItem'
import './Task.css'

export function TaskList({ tasks, loading, onAddTask, onToggleTask, onDeleteTask }) {
  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length

  return (
    <div className="task-list-container">
      <div className="task-header">
        <h2>Today's Tasks</h2>
        {totalCount > 0 && (
          <span className="task-count">
            {completedCount} / {totalCount} completed
          </span>
        )}
      </div>

      <AddTask onAddTask={onAddTask} loading={loading} />

      {loading && tasks.length === 0 ? (
        <div className="loading-state">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add one above to get started!</p>
        </div>
      ) : (
        <div className="tasks">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  )
}

