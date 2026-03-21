import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <span className="text-white font-bold text-xl tracking-tight">
            Todo <span className="text-violet-400">AI</span>
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* User greeting */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-300 text-sm hidden sm:block">
                Hey, <span className="text-white font-medium">{user.name}</span>!
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-red-500/20 hover:text-red-400 border border-gray-700 hover:border-red-500/40 text-gray-300 text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  )
}

export default Navbar