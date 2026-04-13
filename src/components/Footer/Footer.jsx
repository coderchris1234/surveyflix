import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}>surv<span>e</span>yflix</div>
          <p>Join our panel and participate in paid surveys. Make your voice count.</p>
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
