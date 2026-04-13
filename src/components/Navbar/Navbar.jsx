import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>surv<span>e</span>yflix</div>

        {/* Desktop nav */}
        <ul className={styles.nav}>
          <li><a href="#">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><Link to="/login">Sign In</Link></li>
          <li><Link to="/signup" className={styles.joinBtn}>Join Us</Link></li>
        </ul>

        {/* Hamburger */}
        <button className={styles.menuBtn} onClick={() => setOpen(true)} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.open : ''}`}>
        <div className={styles.drawerOverlay} onClick={() => setOpen(false)} />
        <div className={styles.drawerPanel}>
          <button className={styles.drawerClose} onClick={() => setOpen(false)}>×</button>
          <ul className={styles.drawerNav}>
            <li><a href="#" onClick={() => setOpen(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setOpen(false)}>About Us</a></li>
            <li><a href="#" onClick={() => setOpen(false)}>Contact Us</a></li>
            <li><Link to="/login" onClick={() => setOpen(false)}>Sign In</Link></li>
            <li><Link to="/signup" className={styles.drawerJoin} onClick={() => setOpen(false)}>Join Us</Link></li>
          </ul>
        </div>
      </div>
    </>
  )
}
