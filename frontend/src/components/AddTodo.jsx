import { useState } from 'react'

const AddTodo = ({ onAdd }) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await onAdd({ title, dueDate, priority })
    setTitle('')
    setDueDate('')
    setPriority('medium')
    setLoading(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
      <h2 className="text-gray-900 font-medium text-base mb-4">Add new task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Task title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build the login page..."
            required
            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition cursor-pointer"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm text-gray-500 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Adding...
            </span>
          ) : '+ Add task'}
        </button>
      </form>
    </div>
  )
}

export default AddTodo