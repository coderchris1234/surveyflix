/**
 * Admin.jsx — Admin panel for managing gift card claims
 *
 * Accessible at: /admin
 * There is NO authentication on this route — add a password check or
 * auth guard before deploying to production.
 *
 * Data source:
 *   Claims are read from localStorage key "sf_claims" (written by Rewards.jsx).
 *   If no real submissions exist yet, SEED_CLAIMS are shown as demo data.
 *
 * Features:
 *   - Stats bar: total, pending, approved, rejected counts
 *   - Search: filters by name, email, or country
 *   - Status filter: show all / pending / approved / rejected
 *   - Refresh button: re-reads localStorage to pick up new submissions
 *   - Table: click a user's name to open the full detail modal
 *   - Detail modal: shows all personal info, address, and card details
 *   - Approve / Reject buttons: update status in state and persist to localStorage
 *
 * When connecting a real backend:
 *   Replace loadClaims() with an API GET request
 *   Replace updateStatus() with an API PATCH/PUT request
 *   Replace the localStorage.setItem in updateStatus with nothing (backend handles it)
 */
import { useState } from 'react'
import styles from './Admin.module.css'

// Demo data shown when no real user submissions exist in localStorage
const SEED_CLAIMS = [
  {
    id: 1,
    firstName: 'Sophie', lastName: 'Müller',
    email: 'sophie@example.com', phone: '+49 170 1234567',
    address: '12 Berliner Str', city: 'Berlin', country: 'Germany',
    bankName: 'Deutsche Bank', cardHolder: 'Sophie Müller', cardNumber: '4111 1111 1111 1111', expiryDate: '09/27', iban: 'DE89 3704 0044 0532 0130 00', cvv: '123',
    amount: '$200', points: 20000, date: 'Apr 10, 2026', status: 'pending',
  },
  {
    id: 2,
    firstName: 'Lucas', lastName: 'Dupont',
    email: 'lucas@example.com', phone: '+33 6 12 34 56 78',
    address: '5 Rue de Rivoli', city: 'Paris', country: 'France',
    bankName: 'BNP Paribas', cardHolder: 'Lucas Dupont', cardNumber: '5500 0000 0000 0004', expiryDate: '12/26', iban: 'FR76 3000 6000 0112 3456 7890 189', cvv: '456',
    amount: '$500', points: 50000, date: 'Apr 8, 2026', status: 'approved',
  },
]

/**
 * loadClaims — reads claims from localStorage
 * Falls back to SEED_CLAIMS if localStorage is empty or unreadable.
 * Called once on component mount via useState(() => loadClaims())
 */
function loadClaims() {
  try {
    const stored = JSON.parse(localStorage.getItem('sf_claims') || '[]')
    return stored.length > 0 ? stored : SEED_CLAIMS
  } catch {
    return SEED_CLAIMS
  }
}

export default function Admin() {
  // Initialise claims lazily — the function is only called once on first render
  const [claims, setClaims] = useState(() => loadClaims())
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null) // claim shown in the detail modal

  /**
   * updateStatus — changes a claim's status to 'approved' or 'rejected'
   * Updates both React state and localStorage so the change persists on refresh.
   * Also updates the selected claim in the modal if it's currently open.
   */
  const updateStatus = (id, status) => {
    setClaims(c => {
      const updated = c.map(x => x.id === id ? { ...x, status } : x)
      // Persist status change back to localStorage
      const stored = JSON.parse(localStorage.getItem('sf_claims') || '[]')
      if (stored.length > 0) {
        localStorage.setItem('sf_claims', JSON.stringify(
          stored.map(x => x.id === id ? { ...x, status } : x)
        ))
      }
      return updated
    })
    // Keep the modal in sync if it's open for this claim
    if (selected?.id === id) setSelected(s => ({ ...s, status }))
  }

  // Apply search and status filter to the claims list
  const filtered = claims.filter(c => {
    const matchSearch = `${c.firstName} ${c.lastName} ${c.email} ${c.country}`
      .toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  // Counts for the stats bar
  const counts = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'pending').length,
    approved: claims.filter(c => c.status === 'approved').length,
    rejected: claims.filter(c => c.status === 'rejected').length,
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.logo}>surv<span>e</span>yflix</div>
        <span className={styles.adminBadge}>Admin Panel</span>
      </div>

      <div className={styles.content}>
        <p className={styles.pageTitle}>Gift Card Claims</p>

        {/* Stats summary */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Claims</p>
            <p className={styles.statValue}>{counts.total}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Pending</p>
            <p className={`${styles.statValue} ${styles.amber}`}>{counts.pending}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Approved</p>
            <p className={`${styles.statValue} ${styles.green}`}>{counts.approved}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Rejected</p>
            <p className={`${styles.statValue} ${styles.red}`}>{counts.rejected}</p>
          </div>
        </div>

        {/* Search + filter toolbar */}
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Search by name, email, country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            {/* Refresh re-reads localStorage to pick up new submissions without a page reload */}
            <button
              className={styles.filterSelect}
              style={{ cursor: 'pointer', fontWeight: 600, color: '#e50914', borderColor: '#e50914' }}
              onClick={() => setClaims(loadClaims())}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Claims table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>No claims found</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  {/* Clicking the name opens the full detail modal */}
                  <td
                    style={{ cursor: 'pointer', color: '#e50914', fontWeight: 600 }}
                    onClick={() => setSelected(c)}
                  >
                    {c.firstName} {c.lastName}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.country}</td>
                  <td className={styles.amount}>{c.amount}</td>
                  <td>{c.date}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[c.status]}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {c.status !== 'approved' && (
                      <button className={`${styles.actionBtn} ${styles.approveBtn}`} onClick={() => updateStatus(c.id, 'approved')}>
                        Approve
                      </button>
                    )}
                    {c.status !== 'rejected' && (
                      <button className={`${styles.actionBtn} ${styles.rejectBtn}`} onClick={() => updateStatus(c.id, 'rejected')}>
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal — shows full claim info including card details */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <p className={styles.modalTitle}>{selected.firstName} {selected.lastName}</p>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>×</button>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Email</p>
                <p className={styles.detailValue}>{selected.email}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Phone</p>
                <p className={styles.detailValue}>{selected.phone}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>City</p>
                <p className={styles.detailValue}>{selected.city}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Country</p>
                <p className={styles.detailValue}>{selected.country}</p>
              </div>
              <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                <p className={styles.detailLabel}>Address</p>
                <p className={styles.detailValue}>{selected.address}</p>
              </div>

              <hr className={styles.sectionDivider} />

              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Bank Name</p>
                <p className={styles.detailValue}>{selected.bankName}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Card Holder</p>
                <p className={styles.detailValue}>{selected.cardHolder || '—'}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Card Number</p>
                <p className={styles.detailValue}>{selected.cardNumber || selected.accountNumber || '—'}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Expiry Date</p>
                <p className={styles.detailValue}>{selected.expiryDate || '—'}</p>
              </div>
              <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                <p className={styles.detailLabel}>IBAN</p>
                <p className={styles.detailValue}>{selected.iban}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>CVV</p>
                <p className={styles.detailValue}>{selected.cvv || '—'}</p>
              </div>

              <hr className={styles.sectionDivider} />

              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Gift Card</p>
                <p className={styles.detailValue}>{selected.amount}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Points Used</p>
                <p className={styles.detailValue}>{selected.points.toLocaleString()}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Submitted</p>
                <p className={styles.detailValue}>{selected.date}</p>
              </div>
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Status</p>
                <span className={`${styles.badge} ${styles[selected.status]}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Approve/Reject only shown for pending claims */}
            {selected.status === 'pending' && (
              <div className={styles.modalActions}>
                <button className={styles.modalApprove} onClick={() => updateStatus(selected.id, 'approved')}>
                  ✓ Approve
                </button>
                <button className={styles.modalReject} onClick={() => updateStatus(selected.id, 'rejected')}>
                  ✕ Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
