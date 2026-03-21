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
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">

        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-gray-900 font-semibold text-lg">Todo <span className="text-indigo-500">AI</span></span>
        </Link>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-medium">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-600 text-sm hidden sm:block">
                Hey, <span className="text-gray-900 font-medium">{user.name}</span>!
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar