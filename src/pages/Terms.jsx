import { Link } from 'react-router-dom'
import styles from './Terms.module.css'

export default function Terms() {
  return (
    <div className={styles.page}>
      <Link to="/" className={styles.logo}>surv<span>e</span>yflix</Link>

      <h1 className={styles.title}>Terms &amp; Conditions</h1>
      <p className={styles.date}>Last updated: April 2026</p>

      <hr className={styles.divider} />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
        <p className={styles.text}>
          By registering for and using Surveyflix, you agree to be bound by these Terms and Conditions.
          If you do not agree, please do not use our platform.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Eligibility</h2>
        <p className={styles.text}>To use Surveyflix you must:</p>
        <ul className={styles.list}>
          <li>Be at least 18 years of age</li>
          <li>Reside in an eligible country (Europe, USA, or Canada)</li>
          <li>Provide accurate and truthful registration information</li>
          <li>Have a valid email address and phone number</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Panel Membership</h2>
        <p className={styles.text}>
          As a panel member you agree to answer survey questions honestly and to the best of your knowledge.
          Fraudulent, duplicate, or low-quality responses may result in point deductions or account suspension.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Points &amp; Rewards</h2>
        <p className={styles.text}>
          Points are awarded for completed surveys and are non-transferable. Points have no cash value until
          redeemed as a gift card. Surveyflix reserves the right to adjust point values at any time.
          Gift card redemptions require a minimum threshold:
        </p>
        <ul className={styles.list}>
          <li>$200 Gift Card — 20,000 points</li>
          <li>$500 Gift Card — 50,000 points</li>
          <li>$700 Gift Card — 70,000 points</li>
        </ul>
        <p className={styles.text}>
          Redemptions are processed within 3–5 business days after submission of valid personal and bank details.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Your Information</h2>
        <p className={styles.text}>
          We collect personal information solely for the purpose of operating the panel and processing reward
          payments. We do not sell your data to third parties. Your bank details are used exclusively for
          gift card disbursement and are handled securely.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Account Termination</h2>
        <p className={styles.text}>
          Surveyflix may suspend or terminate your account at any time if you violate these terms, provide
          false information, or engage in any form of abuse or fraud. Accumulated points will be forfeited
          upon termination.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Changes to Terms</h2>
        <p className={styles.text}>
          We may update these Terms at any time. Continued use of the platform after changes are posted
          constitutes your acceptance of the revised Terms.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>8. Contact</h2>
        <p className={styles.text}>
          For any questions regarding these Terms, please contact us through the Contact Us page.
        </p>
      </div>

      <Link to="/signup" className={styles.backBtn}>← Back to Sign Up</Link>
    </div>
  )
}
