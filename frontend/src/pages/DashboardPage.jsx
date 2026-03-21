import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import API from '../api/axios'

const DashboardPage = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | high | medium | low
  const [error, setError] = useState('')

  // ── Fetch all todos ──
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data } = await API.get('/todos')
      setTodos(data)
    } catch (err) {
      setError('Failed to load todos.')
    } finally {
      setLoading(false)
    }
  }

  // ── Add todo ──
  const handleAdd = async (todoData) => {
    try {
      const { data } = await API.post('/todos', todoData)
      setTodos([data, ...todos])
    } catch (err) {
      setError('Failed to add todo.')
    }
  }

  // ── Toggle complete ──
  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/todos/${id}/toggle`)
      setTodos(todos.map((t) => (t._id === id ? data : t)))
    } catch (err) {
      setError('Failed to update todo.')
    }
  }

  // ── Edit todo ──
  const handleEdit = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/todos/${id}`, updatedData)
      setTodos(todos.map((t) => (t._id === id ? data : t)))
    } catch (err) {
      setError('Failed to edit todo.')
    }
  }

  // ── Delete todo ──
  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`)
      setTodos(todos.filter((t) => t._id !== id))
    } catch (err) {
      setError('Failed to delete todo.')
    }
  }

  // ── Filter todos ──
  const filteredTodos =
    filter === 'all' ? todos : todos.filter((t) => t.priority === filter)

  // ── Stats ──
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const high = todos.filter((t) => t.priority === 'high' && !t.completed).length

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Error Banner */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex justify-between">
            {error}
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-300">✕</button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{total}</p>
            <p className="text-gray-400 text-sm mt-1">Total</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-violet-400">{completed}</p>
            <p className="text-gray-400 text-sm mt-1">Completed</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{high}</p>
            <p className="text-gray-400 text-sm mt-1">High Priority</p>
          </div>
        </div>

        {/* Add Todo */}
        <AddTodo onAdd={handleAdd} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition duration-200
                ${filter === f
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-violet-500 hover:text-violet-400'
                }`}
            >
              {f === 'all' ? '🗂 All' : f === 'high' ? '🔴 High' : f === 'medium' ? '🟡 Medium' : '🟢 Low'}
            </button>
          ))}
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

      </div>
    </div>
  )
}

export default DashboardPage
