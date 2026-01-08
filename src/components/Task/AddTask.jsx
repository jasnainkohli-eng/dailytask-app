import { useState } from 'react'
import './Task.css'

export function AddTask({ onAddTask, loading }) {
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (content.trim()) {
      await onAddTask(content.trim())
      setContent('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What do you want to accomplish today?"
        className="add-task-input"
        disabled={loading}
      />
      <button
        type="submit"
        className="add-task-button"
        disabled={loading || !content.trim()}
      >
        Add Task
      </button>
    </form>
  )
}

