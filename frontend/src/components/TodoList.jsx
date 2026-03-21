import TodoItem from './TodoItem'

const TodoList = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">📭</span>
        <p className="text-gray-500 text-base font-medium">No tasks yet</p>
        <p className="text-gray-400 text-sm mt-1">Add your first task above to get started.</p>
      </div>
    )
  }

  const pending = todos.filter((t) => !t.completed)
  const completed = todos.filter((t) => t.completed)

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Pending — {pending.length}
          </h3>
          <div className="space-y-2">
            {pending.map((todo) => (
              <TodoItem key={todo._id} todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Completed — {completed.length}
          </h3>
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