import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-between">

        <Link to="/dashboard">
          <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
            Todo <span className="text-indigo-500">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-300 focus:outline-none flex items-center px-0.5
              ${darkMode ? 'bg-indigo-500' : 'bg-gray-200'}`}
            style={{ height: '22px' }}
          >
            <span className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center text-xs
              ${darkMode ? 'translate-x-[18px]' : 'translate-x-0'}`}>
              {darkMode ? '🌙' : '☀️'}
            </span>
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-500 dark:text-zinc-400 hidden sm:block">
                <span className="text-gray-900 dark:text-white font-medium">{user.name}</span>
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-xs font-medium text-gray-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-800 px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar