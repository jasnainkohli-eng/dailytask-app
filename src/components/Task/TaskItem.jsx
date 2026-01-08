import './Task.css'

export function TaskItem({ task, onToggle, onDelete, loading }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          disabled={loading}
          className="task-checkbox"
        />
        <span className="task-text">{task.content}</span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="task-delete"
        disabled={loading}
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  )
}

