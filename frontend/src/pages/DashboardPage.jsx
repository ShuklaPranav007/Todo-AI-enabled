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
    } catch (err) { setError('Failed to add todo.') }
  }

  const handleToggle = async (id) => {
    try {
      const { data } = await API.put(`/todos/${id}/toggle`)
      setTodos(todos.map((t) => (t._id === id ? data : t)))
    } catch (err) { setError('Failed to update todo.') }
  }

  const handleEdit = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/todos/${id}`, updatedData)
      setTodos(todos.map((t) => (t._id === id ? data : t)))
    } catch (err) { setError('Failed to edit todo.') }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`)
      setTodos(todos.filter((t) => t._id !== id))
    } catch (err) { setError('Failed to delete todo.') }
  }

  const filteredTodos = filter === 'all' ? todos : todos.filter((t) => t.priority === filter)
  const total = todos.length
  const completed = todos.filter((t) => t.completed).length
  const high = todos.filter((t) => t.priority === 'high' && !t.completed).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />

      <div className="page-enter max-w-2xl mx-auto px-4 py-8">

        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 text-red-500 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex justify-between items-center">
            {error}
            <button onClick={() => setError('')} className="ml-4 text-red-300 hover:text-red-500 transition-colors">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total', value: total, color: 'text-gray-900 dark:text-white' },
            { label: 'Done', value: completed, color: 'text-indigo-500' },
            { label: 'High', value: high, color: 'text-red-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 text-center">
              <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-400 dark:text-zinc-500 text-xs mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <AddTodo onAdd={handleAdd} />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {['all', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-95
                ${filter === f
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900'
                }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-2 border-gray-200 dark:border-zinc-700 border-t-indigo-500 rounded-full animate-spin"></div>
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