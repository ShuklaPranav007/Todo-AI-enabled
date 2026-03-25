import { useState } from 'react'

const priorityConfig = {
  high:   { label: 'High',   classes: 'bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900' },
  medium: { label: 'Medium', classes: 'bg-amber-50 dark:bg-amber-950 text-amber-500 dark:text-amber-400 border-amber-100 dark:border-amber-900' },
  low:    { label: 'Low',    classes: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-500 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' },
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDueDate, setEditDueDate] = useState(todo.dueDate?.slice(0, 10) || '')
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium')
  const [loading, setLoading] = useState(false)

  const handleEdit = async () => {
    if (!editTitle.trim()) return
    setLoading(true)
    await onEdit(todo._id, { title: editTitle, dueDate: editDueDate, priority: editPriority })
    setIsEditing(false)
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    await onDelete(todo._id)
    setLoading(false)
  }

  const priority = priorityConfig[todo.priority] || priorityConfig.medium

  const isOverdue =
    todo.dueDate &&
    !todo.completed &&
    new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0)

  return (
    <div className={`todo-enter bg-white dark:bg-zinc-900 border rounded-2xl p-4 transition-all duration-200
      ${todo.completed
        ? 'border-gray-50 dark:border-zinc-800/50 opacity-50'
        : 'border-gray-100 dark:border-zinc-800 hover:border-indigo-100 dark:hover:border-zinc-700'}`}>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="flex-1 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 active:scale-95 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-all"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 text-sm font-medium py-2.5 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">

          <button
            onClick={() => onToggle(todo._id)}
            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 active:scale-90
              ${todo.completed
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-gray-300 dark:border-zinc-600 hover:border-indigo-400'}`}
          >
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium break-words transition-all duration-200
              ${todo.completed ? 'line-through text-gray-300 dark:text-zinc-600' : 'text-gray-800 dark:text-zinc-100'}`}>
              {todo.title}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.classes}`}>
                {priority.label}
              </span>

              {todo.dueDate && (
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium
                  ${isOverdue
                    ? 'bg-red-50 dark:bg-red-950 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900'
                    : 'bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border-gray-100 dark:border-zinc-700'}`}>
                  {isOverdue ? 'Overdue · ' : ''}
                  {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {/* Always visible action buttons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-300 dark:text-zinc-600 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2.414a2 2 0 01.586-1.414z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 text-gray-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-150 disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default TodoItem