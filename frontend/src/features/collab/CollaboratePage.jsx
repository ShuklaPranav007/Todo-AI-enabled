import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'
import CreateTeamModal from './CreateTeamModal'
import InviteNotification from './InviteNotification'
import TeamCard from './TeamCard'
import TeamTodoItem from './TeamTodoItem'

const CollaboratePage = () => {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [invites, setInvites] = useState([])
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [teamTodos, setTeamTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [todosLoading, setTodosLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [showTeamList, setShowTeamList] = useState(true)
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchTeams()
    fetchInvites()
  }, [])

  useEffect(() => {
    if (selectedTeam) fetchTeamTodos(selectedTeam._id)
  }, [selectedTeam])

  const fetchTeams = async () => {
    try {
      const { data } = await API.get('/teams')
      setTeams(data)
      if (data.length > 0) setSelectedTeam(data[0])
    } catch (err) {
      setError('Failed to load teams.')
    } finally {
      setLoading(false)
    }
  }

  const fetchInvites = async () => {
    try {
      const { data } = await API.get('/teams/invites')
      setInvites(data)
    } catch (err) {}
  }

  const fetchTeamTodos = async (teamId) => {
    setTodosLoading(true)
    try {
      const { data } = await API.get(`/team-todos/${teamId}`)
      setTeamTodos(data)
    } catch (err) {
      setError('Failed to load tasks.')
    } finally {
      setTodosLoading(false)
    }
  }

  const handleTeamCreated = (newTeam) => {
    setTeams([newTeam, ...teams])
    setSelectedTeam(newTeam)
    setSuccess('Team created!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleTeamUpdated = (updatedTeam) => {
    if (!updatedTeam) {
      const remaining = teams.filter((t) => t._id !== selectedTeam._id)
      setTeams(remaining)
      setSelectedTeam(remaining.length > 0 ? remaining[0] : null)
      setTeamTodos([])
      return
    }
    setTeams(teams.map((t) => (t._id === updatedTeam._id ? updatedTeam : t)))
    setSelectedTeam(updatedTeam)
  }

  const handleInviteRespond = (teamId, status) => {
    setInvites(invites.filter((i) => i._id !== teamId))
    if (status === 'accepted') {
      fetchTeams()
      setSuccess('Joined team!')
    } else {
      setSuccess('Invite declined.')
    }
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    try {
      const { data } = await API.post(`/team-todos/${selectedTeam._id}`, todoForm)
      setTeamTodos([data, ...teamTodos])
      setTodoForm({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' })
      setShowAddTodo(false)
      setSuccess('Task added!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleTodoUpdated = (updatedTodo) => {
    setTeamTodos(teamTodos.map((t) => (t._id === updatedTodo._id ? updatedTodo : t)))
  }

  const handleTodoDeleted = (todoId) => {
    setTeamTodos(teamTodos.filter((t) => t._id !== todoId))
  }

  const isAdmin = selectedTeam?.admin?._id === user?._id || selectedTeam?.admin === user?._id
  const acceptedMembers = selectedTeam?.members?.filter((m) => m.status === 'accepted') || []
  const pendingTodos = teamTodos.filter((t) => !t.completed)
  const completedTodos = teamTodos.filter((t) => t.completed)

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 text-red-500 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex justify-between items-center">
          {error}
          <button onClick={() => setError('')} className="ml-4 text-red-300 hover:text-red-500">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl">
          {success}
        </div>
      )}

      <InviteNotification invites={invites} onRespond={handleInviteRespond} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-gray-200 dark:border-zinc-700 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-5">
          {/* Teams List */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-300 dark:text-zinc-600 uppercase tracking-widest">
                My Teams
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTeamList(!showTeamList)}
                  className="md:hidden text-xs text-gray-400 dark:text-zinc-500 border border-gray-200 dark:border-zinc-700 px-2 py-1 rounded-lg transition-all"
                >
                  {showTeamList ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  + New
                </button>
              </div>
            </div>

            <div className={`${showTeamList ? 'block' : 'hidden'} md:block`}>
              {teams.length === 0 ? (
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-400 dark:text-zinc-500">No teams yet</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-xs text-indigo-500 hover:text-indigo-600 font-medium mt-1 transition-colors"
                  >
                    Create your first team
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {teams.map((team) => (
                    <TeamCard
                      key={team._id}
                      team={team}
                      isSelected={selectedTeam?._id === team._id}
                      onSelect={(team) => {
                        setSelectedTeam(team)
                        setShowTeamList(false)
                      }}
                      onUpdated={handleTeamUpdated}
                      currentUserId={user?._id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Team Tasks */}
          <div className="flex-1 min-w-0">
            {!selectedTeam ? (
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-16 text-center">
                <p className="text-gray-400 dark:text-zinc-500 text-sm">Select or create a team to get started</p>
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white">{selectedTeam.name}</h2>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                        {teamTodos.length} tasks · {completedTodos.length} completed
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setShowAddTodo(!showAddTodo)}
                        className="w-full sm:w-auto text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition-all active:scale-95 text-center"
                      >
                        + Add Task
                      </button>
                    )}
                  </div>

                  {showAddTodo && isAdmin && (
                    <form onSubmit={handleAddTodo} className="mt-4 space-y-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <input
                        type="text"
                        value={todoForm.title}
                        onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                        placeholder="Task title..."
                        required
                        className="w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                      <input
                        type="text"
                        value={todoForm.description}
                        onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
                        placeholder="Description (optional)"
                        className="w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <select
                          value={todoForm.assignedTo}
                          onChange={(e) => setTodoForm({ ...todoForm, assignedTo: e.target.value })}
                          className="bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                        >
                          <option value="">Assign to...</option>
                          {acceptedMembers.map((m) => (
                            <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                          ))}
                        </select>
                        <select
                          value={todoForm.priority}
                          onChange={(e) => setTodoForm({ ...todoForm, priority: e.target.value })}
                          className="bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                        >
                          <option value="low">Low priority</option>
                          <option value="medium">Medium priority</option>
                          <option value="high">High priority</option>
                        </select>
                        <input
                          type="date"
                          value={todoForm.dueDate}
                          onChange={(e) => setTodoForm({ ...todoForm, dueDate: e.target.value })}
                          className="bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
                        >
                          Add Task
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddTodo(false)}
                          className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400 text-sm py-2.5 rounded-xl transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {todosLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="w-7 h-7 border-2 border-gray-200 dark:border-zinc-700 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : teamTodos.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-12 text-center">
                    <p className="text-gray-400 dark:text-zinc-500 text-sm">No tasks yet</p>
                    {isAdmin && (
                      <button
                        onClick={() => setShowAddTodo(true)}
                        className="text-xs text-indigo-500 hover:text-indigo-600 font-medium mt-1 transition-colors"
                      >
                        Add first task
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-5">
                    {pendingTodos.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-3 px-1">
                          Pending — {pendingTodos.length}
                        </p>
                        <div className="space-y-2">
                          {pendingTodos.map((todo) => (
                            <TeamTodoItem
                              key={todo._id}
                              todo={todo}
                              teamId={selectedTeam._id}
                              isAdmin={isAdmin}
                              currentUserId={user?._id}
                              onUpdated={handleTodoUpdated}
                              onDeleted={handleTodoDeleted}
                              acceptedMembers={acceptedMembers}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {completedTodos.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-3 px-1">
                          Completed — {completedTodos.length}
                        </p>
                        <div className="space-y-2">
                          {completedTodos.map((todo) => (
                            <TeamTodoItem
                              key={todo._id}
                              todo={todo}
                              teamId={selectedTeam._id}
                              isAdmin={isAdmin}
                              currentUserId={user?._id}
                              onUpdated={handleTodoUpdated}
                              onDeleted={handleTodoDeleted}
                              acceptedMembers={acceptedMembers}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleTeamCreated}
        />
      )}
    </div>
  )
}

export default CollaboratePage