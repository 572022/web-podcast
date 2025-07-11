import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import axios from 'axios'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        mat_khau: password,
      })

      localStorage.setItem('token', res.data.token)
      navigate('/dashboard')
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Lỗi đăng nhập'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
      >
        <h2 className="text-3xl font-bold font-serif text-center text-blue-600 mb-6 tracking-wide">
          Đăng nhập Admin
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-3 mb-4 rounded-lg focus:outline-blue-400"
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-3 pr-12 rounded-lg focus:outline-blue-400"
            required
          />
          <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-blue-600">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}