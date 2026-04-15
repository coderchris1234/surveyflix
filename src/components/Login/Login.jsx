import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdEmail, MdLock } from 'react-icons/md'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { login, saveUser } from '../../api'
import s from '../SignUp/SignUp.module.css'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.target)
    try {
      const res = await login({
        email: fd.get('email'),
        password: fd.get('password'),
      })
      // Handle both { data: {...} } and flat { ...userDetails } response shapes
      saveUser(res.data || res)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      <div className={s.left}>
        <img src="/hero.jpeg" alt="" className={s.bgImage} />
        <div className={s.leftOverlay} />
        <div className={s.leftContent}>
          <h2 className={s.leftTitle}>Take surveys &amp; earn</h2>
          <p className={s.leftSub}>Try it now!</p>
        </div>
      </div>

      <div className={s.right}>
        <div className={s.card}>
          <p className={s.brandName}>surv<span>e</span>yflix</p>
          <p className={s.cardTitle}>Sign In</p>
          <div className={s.underline} />

          <form onSubmit={handleSubmit}>
            <div className={s.field}>
              <span className={s.fieldIcon}><MdEmail /></span>
              <input name="email" type="email" required placeholder="Enter Email id" className={s.fieldInput} />
            </div>

            <div className={s.field}>
              <span className={s.fieldIcon}><MdLock /></span>
              <input
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Enter Password"
                className={s.fieldInput}
                style={{ paddingRight: 40 }}
              />
              <button type="button" className={s.eyeBtn} onClick={() => setShowPw(v => !v)}>
                {showPw ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            {error && <p style={{ color: '#e50914', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

            <button type="submit" className={s.submitBtn} disabled={loading}>
              {loading ? 'Signing in...' : 'Submit'}
            </button>
          </form>

          <p className={s.bottomLink}>
            Don't have an account? <Link to="/signup">Join Now</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
