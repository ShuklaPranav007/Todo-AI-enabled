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
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">

        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-white font-semibold text-lg">
            Todo <span className="text-indigo-500">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none
              ${darkMode ? 'bg-indigo-500' : 'bg-gray-200'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300
                ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}
            />
            <span className="absolute inset-0 flex items-center justify-between px-1 text-xs pointer-events-none">
              <span>{darkMode ? '' : ''}</span>
              <span className="text-gray-400">{darkMode ? '🌙' : '☀️'}</span>
            </span>
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-600 dark:text-gray-300 text-sm hidden sm:block">
                Hey, <span className="text-gray-900 dark:text-white font-medium">{user.name}</span>!
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-700 hover:border-red-200 px-3 py-1.5 rounded-lg transition duration-200"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar