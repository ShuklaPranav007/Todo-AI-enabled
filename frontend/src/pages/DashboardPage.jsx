import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import API from '../api/axios'

const DashboardPage = () => {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => { fetchTodos() }, [])

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

  const handleAdd = async (todoData) => {
    try {
      const { data } = await API.post('/todos', todoData)
      setTodos([data, ...todos])
    } catch (err) {
      setError('Failed to add todo.')
    }
  }

  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/todos/${id}/toggle`)
      setTodos(todos.map((t) => (t._id === id ? data : t)))
    } catch (err) {
      setError('Failed to update todo.')
    }
  }

  const handleEdit = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/todos/${id}`, updatedData)
      setTodos(todos.map((t) => (t._id === id ? data : t)))
    } catch (err) {
      setError('Failed to edit todo.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`)
      setTodos(todos.filter((t) => t._id !== id))
    } catch (err) {
      setError('Failed to delete todo.')
    }
  }

  const filteredTodos = filter === 'all' ? todos : todos.filter((t) => t.priority === filter)

  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const high = todos.filter((t) => t.priority === 'high' && !t.completed).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-500 dark:text-red-400 text-sm px-4 py-3 rounded-lg flex justify-between">
            {error}
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-500">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{total}</p>
            <p className="text-gray-400 text-xs mt-1">Total</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-semibold text-indigo-500">{completed}</p>
            <p className="text-gray-400 text-xs mt-1">Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-semibold text-red-400">{high}</p>
            <p className="text-gray-400 text-xs mt-1">High priority</p>
          </div>
        </div>

        <AddTodo onAdd={handleAdd} />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition duration-200
                ${filter === f
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-indigo-300 hover:text-indigo-500'
                }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
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