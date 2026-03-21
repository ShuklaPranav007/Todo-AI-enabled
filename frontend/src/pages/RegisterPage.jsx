import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match!')
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Sign up to get started with Todo AI</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating account...
              </span>
            ) : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage