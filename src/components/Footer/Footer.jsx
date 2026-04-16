import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}>surv<span>e</span>yflix</div>
          <p>Join our panel and participate in paid surveys. Make your voice count.</p>
          <a
            href="https://x.com/surveyflixua"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, color: '#aaa', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            @surveyflixua
          </a>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <h4>Company</h4>
            <ul>
              <li><Link to="/#about">About Us</Link></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        &copy; {new Date().getFullYear()} Surveyflix. All rights reserved.
      </div>
    </footer>
  )
}
