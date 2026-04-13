import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdEmail, MdLock } from 'react-icons/md'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import s from '../SignUp/SignUp.module.css'
import ls from './Login.module.css'

export default function Login() {
  const [showPw, setShowPw] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
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
              <input type="email" placeholder="Enter Email id" className={s.fieldInput} />
            </div>

            <div className={s.field}>
              <span className={s.fieldIcon}><MdLock /></span>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter Password"
                className={s.fieldInput}
                style={{ paddingRight: 40 }}
              />
              <button type="button" className={s.eyeBtn} onClick={() => setShowPw(v => !v)}>
                {showPw ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            <div className={ls.rememberRow}>
              <label className={ls.rememberLabel}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className={ls.forgotLink}>Forgot Password?</a>
            </div>

            <button type="submit" className={s.submitBtn}>Submit</button>
          </form>

          <p className={s.bottomLink}>
            Don't have an account? <Link to="/signup">Join Now</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
