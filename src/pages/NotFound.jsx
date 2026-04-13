import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Link to="/" className={styles.logo}>surv<span>e</span>yflix</Link>

      <div className={styles.illustration}>
        <span className={styles.bigNum}>404</span>
        <span className={styles.astronaut}>🧑‍🚀</span>
      </div>

      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.subtitle}>
        Looks like you drifted into deep space. The page you're looking for
        doesn't exist or may have been moved.
      </p>

      <div className={styles.actions}>
        <Link to="/" className={styles.primaryBtn}>Go Home</Link>
        <Link to="/login" className={styles.secondaryBtn}>Sign In</Link>
      </div>
    </div>
  )
}
