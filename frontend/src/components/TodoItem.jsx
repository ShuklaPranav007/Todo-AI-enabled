import { useState } from 'react'

const priorityConfig = {
  high:   { label: '🔴 High',   classes: 'bg-red-500/10 text-red-400 border-red-500/30'     },
  medium: { label: '🟡 Medium', classes: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  low:    { label: '🟢 Low',    classes: 'bg-green-500/10 text-green-400 border-green-500/30'  },
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
    await onEdit(todo._id, {
      title: editTitle,
      dueDate: editDueDate,
      priority: editPriority,
    })
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
    <div className={`bg-gray-900 border rounded-xl p-4 transition duration-200 
      ${todo.completed ? 'border-gray-800 opacity-60' : 'border-gray-700 hover:border-violet-500/50'}`}>

      {isEditing ? (
        /* ── Edit Mode ── */
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 transition"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 transition"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 transition"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Saving...' : '✅ Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>

      ) : (
        /* ── View Mode ── */
        <div className="flex items-start gap-3">

          {/* Checkbox */}
          <button
            onClick={() => onToggle(todo._id)}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition duration-200
              ${todo.completed
                ? 'bg-violet-600 border-violet-600'
                : 'border-gray-500 hover:border-violet-400'}`}
          >
            {todo.completed && (
              <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium break-words
              ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
              {todo.title}
            </p>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mt-2">

              {/* Priority Badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full border ${priority.classes}`}>
                {priority.label}
              </span>

              {/* Due Date Badge */}
              {todo.dueDate && (
                <span className={`text-xs px-2 py-0.5 rounded-full border
                  ${isOverdue
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                  📅 {isOverdue ? 'Overdue · ' : ''}
                  {new Date(todo.dueDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
              )}

              {/* Completed Badge */}
              {todo.completed && (
                <span className="text-xs px-2 py-0.5 rounded-full border bg-violet-500/10 text-violet-400 border-violet-500/30">
                  ✓ Done
                </span>
              )}

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-violet-400 transition duration-200 p-1"
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-gray-500 hover:text-red-400 transition duration-200 p-1 disabled:opacity-50"
              title="Delete"
            >
              🗑️
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default TodoItem