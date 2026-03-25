import { useState } from 'react'

const AddTodo = ({ onAdd }) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await onAdd({ title, dueDate, priority })
    setTitle('')
    setDueDate('')
    setPriority('medium')
    setLoading(false)
    setExpanded(false)
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 mb-5 transition-all duration-200">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setExpanded(true) }}
            onFocus={() => setExpanded(true)}
            placeholder="Add a new task..."
            required
            className="flex-1 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150 whitespace-nowrap"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : '+ Add'}
          </button>
        </div>

        {expanded && (
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
          </div>
        )}
      </form>
    </div>
  )
}

export default AddTodo