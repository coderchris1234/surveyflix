import { Link } from 'react-router-dom'
import styles from './WhyJoin.module.css'

export default function WhyJoin() {
  return (
    <section className={styles.section}>
      <img src="/section1.jpeg" alt="Person smiling at laptop" className={styles.image} />
      <div className={styles.content}>
        <h2 className={styles.title}>Why join our panel</h2>
        <p className={styles.description}>
          When you join our panel, you become part of our online
          community that influences the decision of businesses to create
          better and affordable products and services. We are trusted by
          millions of consumers to voice their opinions.
        </p>
        <Link to="/signup" className={styles.cta}>Take Your First Step</Link>
      </div>
    </section>
  )
}
