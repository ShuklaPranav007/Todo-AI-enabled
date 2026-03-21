import API from '../api/axios'

const InviteNotification = ({ invites, onRespond }) => {
  if (!invites || invites.length === 0) return null

  const handleRespond = async (teamId, status) => {
    try {
      await API.put(`/teams/${teamId}/invite/respond`, { status })
      onRespond(teamId, status)
    } catch (err) {
      console.error('Failed to respond to invite:', err.message)
    }
  }

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-3">
        Pending Invites — {invites.length}
      </p>
      <div className="space-y-2">
        {invites.map((invite) => (
          <div
            key={invite._id}
            className="bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {invite.name}
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                Invited by{' '}
                <span className="text-indigo-500 font-medium">
                  {invite.admin?.name}
                </span>
              </p>
              {invite.description && (
                <p className="text-xs text-gray-400 dark:text-zinc-600 mt-0.5 truncate">
                  {invite.description}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleRespond(invite._id, 'accepted')}
                className="text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg transition-all active:scale-95"
              >
                Accept
              </button>
              <button
                onClick={() => handleRespond(invite._id, 'declined')}
                className="text-xs font-semibold bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400 px-4 py-1.5 rounded-lg transition-all active:scale-95"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InviteNotification
