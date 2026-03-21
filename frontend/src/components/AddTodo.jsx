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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
      <h2 className="text-white font-semibold text-lg mb-4">➕ Add New Todo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build the login page..."
            required
            className="w-full bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        {/* Due Date & Priority Row */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Due Date */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500 transition cursor-pointer"
            />
          </div>

          {/* Priority */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500 transition cursor-pointer"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Adding...
            </span>
          ) : '+ Add Todo'}
        </button>

      </form>
    </div>
  )
}

export default AddTodo