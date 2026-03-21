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
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match!')
    if (formData.password.length < 6) return setError('Password must be at least 6 characters.')
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
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
      <div className="page-enter w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Todo <span className="text-indigo-500">AI</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Your smart task manager</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-7">

          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Create account</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Get started for free</p>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900 text-red-500 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: '••••••••' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-medium text-gray-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-600 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-200"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all duration-150 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="text-center text-gray-400 dark:text-zinc-500 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage