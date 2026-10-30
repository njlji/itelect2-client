import { useState } from 'react'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddTask(title)
    setTitle('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a task"
      />
      <button type="submit">Add task</button>
    </form>
  )
}

export default TaskForm
