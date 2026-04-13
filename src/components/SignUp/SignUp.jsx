import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdEmail, MdLock, MdPerson, MdLocationCity } from 'react-icons/md'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import s from './SignUp.module.css'

const countries = [
  { code: 'us', name: 'United States',  dial: '+1'   },
  { code: 'ca', name: 'Canada',         dial: '+1'   },
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
  const [selectedCountry, setSelectedCountry] = useState('')
  const [showPw, setShowPw] = useState(false)

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

          {/* Name row */}
          <div className={s.row}>
            <div className={s.field}>
              <span className={s.fieldIcon}><MdPerson /></span>
              <input required type="text" placeholder="First Name" className={s.fieldInput} />
            </div>
            <div className={s.field}>
              <span className={s.fieldIcon}><MdPerson /></span>
              <input required type="text" placeholder="Last Name" className={s.fieldInput} />
            </div>
          </div>

          {/* Email */}
          <div className={s.field}>
            <span className={s.fieldIcon}><MdEmail /></span>
            <input required type="email" placeholder="Email" className={s.fieldInput} />
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
            <input required type="tel" placeholder="Mobile Number" className={s.phoneInput} />
          </div>

          {/* City + Country row */}
          <div className={s.row}>
            <div className={s.field}>
              <span className={s.fieldIcon}><MdLocationCity /></span>
              <input required type="text" placeholder="City" className={s.fieldInput} />
            </div>
            <div className={s.field}>
              <select
                required
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className={s.fieldSelect}
              >
                <option value="">Country</option>
                {countries.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Password */}
          <div className={s.field}>
            <span className={s.fieldIcon}><MdLock /></span>
            <input
              required
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              className={s.fieldInput}
              style={{ paddingRight: 40 }}
            />
            <button type="button" className={s.eyeBtn} onClick={() => setShowPw(v => !v)}>
              {showPw ? <HiEyeOff /> : <HiEye />}
            </button>
          </div>

          <label className={s.termsRow}>
            <input type="checkbox" required />
            I agreed <a href="#">T&amp;C</a> and <a href="#">Privacy Policy</a>
          </label>

          <button className={s.submitBtn}>Sign Up</button>

          <p className={s.bottomLink}>
            Already Registered? <Link to="/login">Sign In Now</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
