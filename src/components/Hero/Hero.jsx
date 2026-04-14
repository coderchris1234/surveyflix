import { Link } from 'react-router-dom'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <img src="/hero2.jpeg" alt="" className={styles.bgImage} />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>surveyflix</p>
        <h1 className={styles.title}>Make your voice count</h1>
        <p className={styles.description}>
          Join our panel and participate in paid surveys. We give you the
          opportunity to voice your opinions. Everytime you participate in a
          survey, you directly influence services and the products that we use in
          our everyday lives
        </p>
        <Link to="/signup" className={styles.cta}>Get Started</Link>
      </div>
    </section>
  )
}
