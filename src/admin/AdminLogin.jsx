import { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { adminLogin, saveAdminToken } from '../api'
import styles from './AdminLogin.module.css'

export default function AdminLogin({ onSuccess }) {
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.target)
    try {
      const res = await adminLogin({
        userName: fd.get('userName'),
        password: fd.get('password'),
      })
      // Backend returns a JWT token — save it to sessionStorage
      const token = res.token || res.data?.token
      if (!token) throw new Error('No token received from server.')
      saveAdminToken(token)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.logo}>surv<span>e</span>yflix</p>
        <p className={styles.title}>Admin Panel</p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              name="userName"
              type="text"
              required
              placeholder="Enter username"
              className={styles.input}
              autoComplete="off"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type={showPw ? 'text' : 'password'}
              required
              placeholder="Enter password"
              className={styles.input}
              autoComplete="new-password"
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(v => !v)}>
              {showPw ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
