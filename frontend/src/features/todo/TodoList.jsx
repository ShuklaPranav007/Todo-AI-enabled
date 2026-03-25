import TodoItem from './TodoItem'

const TodoList = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gray-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-400 dark:text-zinc-500 text-sm font-medium">No tasks yet</p>
        <p className="text-gray-300 dark:text-zinc-700 text-xs mt-1">Add your first task above</p>
      </div>
    )
  }

  const pending = todos.filter((t) => !t.completed)
  const completed = todos.filter((t) => t.completed)

  return (
    <div className="space-y-5">
      {pending.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-3 px-1">
            Pending — {pending.length}
          </p>
          <div className="space-y-2">
            {pending.map((todo) => (
              <TodoItem key={todo._id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-3 px-1">
            Completed — {completed.length}
          </p>
          <div className="space-y-2">
            {completed.map((todo) => (
              <TodoItem key={todo._id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList