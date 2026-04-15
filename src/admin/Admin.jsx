/**
 * Admin.jsx — Admin panel for viewing user gift card claims
 *
 * Accessible at: /admin
 * Protected by admin login — shows AdminLogin.jsx if no JWT token is found
 * in sessionStorage. Token is saved after successful POST /Dladmin.
 *
 * Data source:
 *   Fetches all users from GET /Duser using the admin JWT token.
 *   Each user row in the table represents a registered user.
 *   Clicking a user's name opens a detail modal showing all their info
 *   including any bank/card details they submitted via the claim form.
 *
 * Currently visible table columns: #, Name, Email
 * Commented-out columns (uncomment when needed):
 *   Country, Amount, Date, Status, Actions
 *
 * Commented-out features (uncomment when needed):
 *   Stats bar (total/pending/approved/rejected counts)
 *   Approve / Reject buttons
 *
 * Detail modal:
 *   Shows all fields returned by the backend for that user.
 *   Sensitive/internal fields are filtered out (password, __v, etc).
 *   Any unknown fields from the backend are rendered automatically.
 *   Date fields are formatted as "12 Apr 2026".
 */
import { useState, useEffect, useCallback } from 'react'
import { getAdminToken, clearAdminToken, adminGetAllUsers } from '../api'
import AdminLogin from './AdminLogin'
import styles from './Admin.module.css'

function formatDate(val) {
  if (!val || val === '—') return '—'
  const d = new Date(val)
  if (isNaN(d)) return val
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Admin() {
  const [isAuthed, setIsAuthed] = useState(!!getAdminToken())
  const [claims, setClaims] = useState([])
  const [loadingClaims, setLoadingClaims] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const fetchClaims = useCallback(() => {
    setLoadingClaims(true)
    setFetchError('')
    adminGetAllUsers()
      .then(res => {
        const users = res.data || res
        const mapped = Array.isArray(users) ? users.map(u => ({
          id: u.id || u._id,
          firstName: u.firstName || u.fullName?.split(' ')[0] || '',
          lastName: u.lastName || u.fullName?.split(' ').slice(1).join(' ') || '',
          email: u.email || '',
          phone: u.phoneNumber || '',
          country: u.country || '—',
          accountNumber: u.accountNumber || '—',
          date: u.date || u.createdAt || '—',
          status: u.status || 'pending',
          _raw: u,
        })) : []
        setClaims(mapped)
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setLoadingClaims(false))
  }, [])

  // Load users from backend whenever auth state becomes true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (isAuthed) fetchClaims() }, [isAuthed])

  const updateStatus = (id, status) => {
    setClaims(c => c.map(x => x.id === id ? { ...x, status } : x))
    if (selected?.id === id) setSelected(s => ({ ...s, status }))
  }

  // Apply search and status filter to the claims list
  const filtered = claims.filter(c => {
    const matchSearch = `${c.firstName} ${c.lastName} ${c.email} ${c.country}`
      .toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  // Counts for the stats bar — commented out with stats cards
  // const counts = {
  //   total: claims.length,
  //   pending: claims.filter(c => c.status === 'pending').length,
  //   approved: claims.filter(c => c.status === 'approved').length,
  //   rejected: claims.filter(c => c.status === 'rejected').length,
  // }

  if (!isAuthed) {
    return <AdminLogin onSuccess={() => setIsAuthed(true)} />
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.logo}>surv<span>e</span>yflix</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className={styles.adminBadge}>Admin Panel</span>
          <button
            onClick={() => { clearAdminToken(); setIsAuthed(false) }}
            style={{
              background: 'rgba(229,9,20,0.15)', color: '#e50914', border: 'none',
              borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.pageTitle}>Gift Card Claims</p>

        {/* Stats summary — commented out for now
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
        */}

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
            {/* Refresh re-fetches all users from the backend */}
            <button
              className={styles.filterSelect}
              style={{ cursor: 'pointer', fontWeight: 600, color: '#e50914', borderColor: '#e50914' }}
              onClick={fetchClaims}
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
                {/* <th>Country</th> */}
                {/* <th>Amount</th> */}
                {/* <th>Date</th> */}
                {/* <th>Status</th> */}
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {loadingClaims && (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>Loading users...</td></tr>
              )}
              {fetchError && (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: '#e50914', padding: 32 }}>{fetchError}</td></tr>
              )}
              {!loadingClaims && !fetchError && filtered.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', color: '#aaa', padding: 32 }}>No claims found</td></tr>
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
                  {/* <td>{c.country}</td> */}
                  {/* <td className={styles.amount}>{c.amount}</td> */}
                  {/* <td>{formatDate(c.date)}</td> */}
                  {/* <td>
                    <span className={`${styles.badge} ${styles[c.status]}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td> */}
                  {/* <td>
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
                  </td> */}
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
                <p className={styles.detailLabel}>Country</p>
                <p className={styles.detailValue}>{selected.country}</p>
              </div>
              
              <div className={styles.detailItem}>
                <p className={styles.detailLabel}>Status</p>
                <span className={`${styles.badge} ${styles[selected.status]}`}>
                  {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                </span>
              </div>
              {/* Show any extra fields the backend returns */}
              {selected._raw && Object.entries(selected._raw)
                .filter(([k]) => !['id','_id','fullName','firstName','lastName','email','phoneNumber','accountNumber','date','status','createdAt','country','__v','password','totalPoints','surveyCompleted','totalCompleted'].includes(k))
                .map(([k, v]) => {
                  if (typeof v === 'string' && (k.toLowerCase().includes('date') || k.toLowerCase().includes('at'))) {
                    return (
                      <div key={k} className={styles.detailItem}>
                        <p className={styles.detailLabel}>{k}</p>
                        <p className={styles.detailValue}>{formatDate(v)}</p>
                      </div>
                    )
                  }
                  if (typeof v === 'object') return null
                  return (
                    <div key={k} className={styles.detailItem}>
                      <p className={styles.detailLabel}>{k}</p>
                      <p className={styles.detailValue}>{String(v)}</p>
                    </div>
                  )
                })
              }
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
