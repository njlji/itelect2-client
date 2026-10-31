import { useEffect, useState } from 'react'
import './App.css'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const apiUrl = import.meta.env.VITE_API_URL

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [loginError, setLoginError] = useState('')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false)

  const loadTasks = async () => {
    if (!token) {
      setTasks([])
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiUrl}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
    if (!token) {
      setTasks([])
      setLoading(false)
      setError('')
      return
    }

    loadTasks()
  }, [token])

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

      localStorage.setItem('token', data.token)
      setToken(data.token)
      setLoginForm({ email: '', password: '' })
    } catch (loginFailure) {
      setLoginError(loginFailure.message || 'Login failed.')
    } finally {
      setIsSubmittingLogin(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    setTasks([])
    setError('')
    setLoginError('')
  }

  return (
    <main className="app-shell">
      <h1>Task Tracker</h1>

      {!token ? (
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
      ) : (
        <>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>

          <TaskForm token={token} onTaskAdded={loadTasks} />

          {loading && <p>Loading...</p>}
          {!loading && error && <p className="error-message">{error}</p>}
          {!loading && !error && tasks.length === 0 && <p className="empty-state">No tasks found.</p>}
          {!loading && !error && tasks.length > 0 && <TaskList tasks={tasks} />}
        </>
      )}

      {loginError && <p className="error-message">{loginError}</p>}
    </main>
  )
}

export default App
