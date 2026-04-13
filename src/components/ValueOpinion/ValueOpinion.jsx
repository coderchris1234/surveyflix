import { Link } from 'react-router-dom'
import styles from './ValueOpinion.module.css'

const steps = ['Login your account', 'Submit topics', 'Participate in the debate']

export default function ValueOpinion() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>We value your opinion</h2>
        <p className={styles.description}>
          We provide you with a platform to express your opinions on
          trending issues globally without bias.
        </p>
        <ul className={styles.list}>
          {steps.map((step) => (
            <li key={step}>
              <span className={styles.checkIcon} aria-hidden="true" />
              {step}
            </li>
          ))}
        </ul>
        <Link to="/login" className={styles.cta}>Login to Continue</Link>
      </div>
      <img src="/section2.jpeg" alt="People collaborating at a table" className={styles.image} />
    </section>
  )
}
