import { useState } from 'react'

const priorityConfig = {
  high:   { label: 'High',   classes: 'bg-red-50 text-red-600 border-red-200'       },
  medium: { label: 'Medium', classes: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  low:    { label: 'Low',    classes: 'bg-green-50 text-green-600 border-green-200'   },
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
    <div className={`bg-white border rounded-xl p-4 transition duration-200
      ${todo.completed ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-indigo-200'}`}>

      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="flex-1 bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="flex-1 bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition"
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
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>

      ) : (
        <div className="flex items-start gap-3">

          <button
            onClick={() => onToggle(todo._id)}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition duration-200
              ${todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-400'}`}
          >
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium break-words
              ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {todo.title}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${priority.classes}`}>
                {priority.label}
              </span>

              {todo.dueDate && (
                <span className={`text-xs px-2 py-0.5 rounded-full border
                  ${isOverdue
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {isOverdue ? 'Overdue · ' : ''}
                  {new Date(todo.dueDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
              )}

              {todo.completed && (
                <span className="text-xs px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-500 border-indigo-200">
                  Done
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-indigo-500 transition p-1 text-sm"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-gray-400 hover:text-red-500 transition p-1 text-sm disabled:opacity-50"
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