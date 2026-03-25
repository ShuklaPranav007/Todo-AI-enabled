import { useState } from 'react'
import API from '../../api/axios'

const TeamCard = ({ team, isSelected, onSelect, onUpdated, currentUserId }) => {
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isAdmin = team.admin._id === currentUserId || team.admin === currentUserId
  const acceptedMembers = team.members?.filter((m) => m.status === 'accepted') || []
  const pendingMembers = team.members?.filter((m) => m.status === 'pending') || []

  const handleInvite = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post(`/teams/${team._id}/invite`, { email: inviteEmail })
      onUpdated(data)
      setInviteEmail('')
      setShowInviteForm(false)
      setSuccess('Invite sent!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (userId) => {
    try {
      await API.delete(`/teams/${team._id}/members/${userId}`)
      const updated = {
        ...team,
        members: team.members.filter((m) => m.user._id !== userId),
      }
      onUpdated(updated)
    } catch (err) {
      setError('Failed to remove member.')
    }
  }

  const handleDeleteTeam = async () => {
    if (!window.confirm('Delete this team? This cannot be undone.')) return
    try {
      await API.delete(`/teams/${team._id}`)
      onUpdated(null)
    } catch (err) {
      setError('Failed to delete team.')
    }
  }

  return (
    <div
      className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-100 dark:ring-indigo-900/50'
          : 'border-gray-100 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-zinc-700'
        }`}
      onClick={() => onSelect(team)}
    >
      {/* Team Header */}
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors
          ${isSelected
            ? 'bg-indigo-500 text-white'
            : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400'
          }`}>
          {team.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{team.name}</p>
          {team.description && (
            <p className="text-xs text-gray-400 dark:text-zinc-500 truncate mt-0.5">{team.description}</p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); handleDeleteTeam() }}
            className="p-1.5 text-gray-300 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Members */}
      <div className="flex flex-wrap gap-1.5 mt-3" onClick={(e) => e.stopPropagation()}>
        <span className="text-xs px-2 py-0.5 rounded-full border bg-indigo-50 dark:bg-indigo-950 text-indigo-500 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900 font-medium">
          {team.admin.name}
        </span>
        {acceptedMembers.map((m) => (
          <span
            key={m.user._id}
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-700 font-medium"
          >
            {m.user.name}
            {isAdmin && (
              <button
                onClick={() => handleRemoveMember(m.user._id)}
                className="text-gray-300 dark:text-zinc-600 hover:text-red-500 transition-colors leading-none"
              >
                ×
              </button>
            )}
          </span>
        ))}
        {pendingMembers.map((m) => (
          <span
            key={m.user._id}
            className="text-xs px-2 py-0.5 rounded-full border bg-amber-50 dark:bg-amber-950 text-amber-500 dark:text-amber-400 border-amber-100 dark:border-amber-900 font-medium"
          >
            {m.user.name} · pending
          </span>
        ))}
      </div>

      {/* Role + Invite */}
      <div className="flex items-center justify-between mt-3" onClick={(e) => e.stopPropagation()}>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border
          ${isAdmin
            ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-500 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900'
            : 'bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 border-gray-100 dark:border-zinc-700'
          }`}>
          {isAdmin ? 'Admin' : 'Member'}
        </span>
        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowInviteForm(!showInviteForm) }}
            className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 border border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950 px-3 py-1 rounded-lg transition-all active:scale-95"
          >
            + Invite
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      {success && <p className="text-xs text-emerald-500 mt-2">{success}</p>}

      {/* Invite Form */}
      {showInviteForm && isAdmin && (
        <form
          onSubmit={handleInvite}
          className="mt-3 space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email to invite..."
            required
            className="w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-xl transition-all active:scale-95"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
            <button
              type="button"
              onClick={() => setShowInviteForm(false)}
              className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400 text-xs py-2 rounded-xl transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default TeamCard