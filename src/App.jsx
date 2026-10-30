import { useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const initialTasks = [
  { id: 1, title: 'Design homepage mockups', dueDate: '2026-10-20' },
  { id: 2, title: 'Review sprint checklist', dueDate: '2026-10-22' },
  { id: 3, title: 'Prepare project demo', dueDate: '2026-10-25' },
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)

  const handleAddTask = (title) => {
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    const newTask = {
      id: Date.now(),
      title: trimmedTitle,
      dueDate: new Date().toISOString().slice(0, 10),
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
  }

  return (
    <main className="app-shell">
      <h1>Task Tracker</h1>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList tasks={tasks} />
    </main>
  )
}

export default App
