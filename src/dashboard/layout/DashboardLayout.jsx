import { useState } from 'react'
import styles from './DashboardLayout.module.css'

const navItems = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  },
  {
    id: 'surveys', label: 'Surveys',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
  },
  {
    id: 'rewards', label: 'Gift Cards',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
  },
  {
    id: 'history', label: 'Points History',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  },
  {
    id: 'profile', label: 'My Profile',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  },
]

const pageTitles = {
  overview: 'Dashboard Overview',
  surveys: 'Available Surveys',
  rewards: 'Gift Card Rewards',
  history: 'Points History',
  profile: 'My Profile',
}

export default function DashboardLayout({ activePage, onNavigate, points, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navigate = (id) => {
    onNavigate(id)
    setDrawerOpen(false)
  }

  return (
    <div className={styles.layout}>
      {/* Mobile overlay */}
      <div
        className={`${styles.drawerOverlay} ${drawerOpen ? styles.open : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={`${styles.sidebar} ${drawerOpen ? styles.open : ''}`}>
        <div className={styles.sidebarLogo}>surv<span>e</span>yflix</div>
        <ul className={styles.nav}>
          {navItems.map(item => (
            <li key={item.id}>
              <div
                className={`${styles.navItem} ${activePage === item.id ? styles.active : ''}`}
                onClick={() => navigate(item.id)}
              >
                {item.icon}
                {item.label}
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>S</div>
            <div>
              <div className={styles.userName}>Sophie M.</div>
              <div className={styles.userRole}>Panel Member</div>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuBtn} onClick={() => setDrawerOpen(o => !o)} aria-label="Toggle menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className={styles.topbarTitle}>{pageTitles[activePage]}</span>
          </div>
          <div className={styles.pointsBadge}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {points.toLocaleString()} pts
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
