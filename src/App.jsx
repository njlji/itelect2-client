import { useEffect, useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false)

  const loadTasks = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiUrl}/api/tasks`)

      if (!response.ok) {
        throw new Error('Unable to load tasks.')
      }

      const data = await response.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load tasks.')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    setLoginError('')
    setIsSubmittingLogin(true)

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.')
      }

      setToken(data.token)
      setLoginForm({ email: '', password: '' })
    } catch (loginFailure) {
      setLoginError(loginFailure.message || 'Login failed.')
    } finally {
      setIsSubmittingLogin(false)
    }
  }

  return (
    <main className="app-shell">
      <h1>Task Tracker</h1>

      <form className="login-form" onSubmit={handleLoginSubmit}>
        <h2>Login</h2>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={loginForm.email}
          onChange={handleLoginChange}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={loginForm.password}
          onChange={handleLoginChange}
          placeholder="Password"
          required
        />

        <button type="submit" disabled={isSubmittingLogin}>
          {isSubmittingLogin ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {loginError && <p className="error-message">{loginError}</p>}

      <TaskForm token={token} onTaskAdded={loadTasks} />

      {loading && <p>Loading...</p>}
      {!loading && error && <p className="error-message">{error}</p>}
      {!loading && !error && tasks.length === 0 && <p className="empty-state">No tasks found.</p>}
      {!loading && !error && tasks.length > 0 && <TaskList tasks={tasks} />}
    </main>
  )
}

export default App
