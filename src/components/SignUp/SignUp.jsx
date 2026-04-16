/**
 * SignUp.jsx — User registration page
 *
 * Collects: firstName, lastName, email, phoneNumber (dial code + number), password
 * Sends POST /Duser on submit.
 *
 * On success:
 *   1. Saves user object to localStorage via saveUser()
 *   2. Shows a password reminder modal (no recovery exists on this platform)
 *   3. "OK, I've saved my password" button routes to /login
 *
 * Phone field has a country picker (flag + dial code) for US, Canada,
 * Nigeria, and all European countries.
 * Password field has show/hide toggle and autoComplete="new-password"
 * to prompt the browser to offer to save the password.
 * Terms & Conditions checkbox is required — links to /terms.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdEmail, MdLock, MdPerson } from 'react-icons/md'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { signup, saveUser } from '../../api'
import s from './SignUp.module.css'

const countries = [
  { code: 'us', name: 'United States',  dial: '+1'   },
  { code: 'ca', name: 'Canada',         dial: '+1'   },
  { code: 'ng', name: 'Nigeria',        dial: '+234' },
  { code: 'de', name: 'Germany',        dial: '+49'  },
  { code: 'fr', name: 'France',         dial: '+33'  },
  { code: 'it', name: 'Italy',          dial: '+39'  },
  { code: 'es', name: 'Spain',          dial: '+34'  },
  { code: 'nl', name: 'Netherlands',    dial: '+31'  },
  { code: 'be', name: 'Belgium',        dial: '+32'  },
  { code: 'pt', name: 'Portugal',       dial: '+351' },
  { code: 'se', name: 'Sweden',         dial: '+46'  },
  { code: 'no', name: 'Norway',         dial: '+47'  },
  { code: 'dk', name: 'Denmark',        dial: '+45'  },
  { code: 'fi', name: 'Finland',        dial: '+358' },
  { code: 'pl', name: 'Poland',         dial: '+48'  },
  { code: 'at', name: 'Austria',        dial: '+43'  },
  { code: 'ch', name: 'Switzerland',    dial: '+41'  },
  { code: 'gb', name: 'United Kingdom', dial: '+44'  },
  { code: 'ie', name: 'Ireland',        dial: '+353' },
  { code: 'gr', name: 'Greece',         dial: '+30'  },
  { code: 'cz', name: 'Czech Republic', dial: '+420' },
  { code: 'ro', name: 'Romania',        dial: '+40'  },
  { code: 'hu', name: 'Hungary',        dial: '+36'  },
]

export default function SignUp() {
  const [country, setCountry] = useState(countries[0])
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showReminder, setShowReminder] = useState(false) // password reminder modal
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.target)
    const body = {
      firstName: fd.get('firstName'),
      lastName: fd.get('lastName'),
      email: fd.get('email'),
      phoneNumber: `${country.dial}${fd.get('phone')}`,
      password: fd.get('password'),
    }

    try {
      const res = await signup(body)
      saveUser(res.data || res)
      // Show the password reminder modal before routing to login
      setShowReminder(true)
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
          <p className={s.cardTitle}>Sign Up</p>
          <div className={s.underline} />

          <form onSubmit={handleSubmit} noValidate={false}>
            {/* Name row */}
            <div className={s.row}>
              <div className={s.field}>
                <span className={s.fieldIcon}><MdPerson /></span>
                <input required name="firstName" type="text" placeholder="First Name" className={s.fieldInput} />
              </div>
              <div className={s.field}>
                <span className={s.fieldIcon}><MdPerson /></span>
                <input required name="lastName" type="text" placeholder="Last Name" className={s.fieldInput} />
              </div>
            </div>

            {/* Email */}
            <div className={s.field}>
              <span className={s.fieldIcon}><MdEmail /></span>
              <input required name="email" type="email" placeholder="Email" className={s.fieldInput} />
            </div>

            {/* Phone */}
            <div className={s.phoneRow}>
              <div className={s.countryPicker}>
                <img src={`https://flagcdn.com/w40/${country.code}.png`} alt="" className={s.flagImg} />
                <span className={s.dialCode}>{country.dial}</span>
                <span className={s.chevron}>▼</span>
                <select
                  value={country.code}
                  onChange={e => setCountry(countries.find(c => c.code === e.target.value))}
                  aria-label="Country code"
                >
                  {countries.map(c => (
                    <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>
                  ))}
                </select>
              </div>
              <input required name="phone" type="tel" placeholder="Mobile Number" className={s.phoneInput} />
            </div>

            {/* Password */}
            <div className={s.field}>
              <span className={s.fieldIcon}><MdLock /></span>
              <input
                required
                name="password"
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                className={s.fieldInput}
                autoComplete="new-password"
                style={{ paddingRight: 40 }}
              />
              <button type="button" className={s.eyeBtn} onClick={() => setShowPw(v => !v)}>
                {showPw ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>

            {/* Terms checkbox */}
            <label className={s.termsRow}>
              <input type="checkbox" required />
              I agree to the <Link to="/terms">Terms &amp; Conditions</Link>
            </label>

            {error && <p style={{ color: '#e50914', fontSize: 13, margin: '0 0 12px' }}>{error}</p>}

            <button type="submit" className={s.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className={s.bottomLink}>
            Already Registered? <Link to="/login">Sign In Now</Link>
          </p>
        </div>
      </div>

      {/* Password reminder modal — shown after successful signup */}
      {showReminder && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 16,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '36px 32px',
            maxWidth: 380, width: '100%', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 12px' }}>
              Save your password!
            </p>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: '0 0 8px' }}>
              Your account has been created successfully.
            </p>
            <p style={{ fontSize: 14, color: '#e50914', fontWeight: 600, lineHeight: 1.7, margin: '0 0 28px' }}>
              ⚠️ There is no password recovery on this platform. If you forget your password, you will not be able to access your account. Please save it somewhere safe before continuing.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', height: 46, background: '#e50914', color: '#fff',
                border: 'none', borderRadius: 24, fontSize: 15, fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              OK, I've saved my password
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
