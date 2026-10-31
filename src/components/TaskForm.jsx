import { useState } from 'react'

const apiUrl = import.meta.env.VITE_API_URL

function TaskForm({ token, onTaskAdded }) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    if (!token) {
      setStatus('Please log in before creating a task.')
      return
    }

    try {
      setIsSubmitting(true)
      setStatus('')

      const response = await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: trimmedTitle,
          dueDate: new Date().toISOString().slice(0, 10),
          completed: false,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Unable to create task.')
      }

      setTitle('')
      await onTaskAdded()
    } catch (taskError) {
      setStatus(taskError.message || 'Unable to create task.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form className="task-form" onSubmit={handleSubmit}>
        <label htmlFor="task-title">Task title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task"
        />
        <button type="submit" disabled={isSubmitting || !token}>
          {isSubmitting ? 'Saving...' : 'Add task'}
        </button>
      </form>
      {status && <p className="error-message">{status}</p>}
    </>
  )
}

export default TaskForm
