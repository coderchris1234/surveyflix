import styles from './AboutUs.module.css'

const cards = [
  {
    title: 'Our Mission',
    text: 'To connect businesses with real consumers and give everyday people a platform to shape the products and services they use.',
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
    ),
  },
  {
    title: 'Who We Are',
    text: 'Surveyflix is a trusted online survey panel operating across Europe, connecting millions of consumers with leading brands and research firms.',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    ),
  },
  {
    title: 'What We Offer',
    text: 'Paid surveys, reward points, and exclusive member benefits. Every opinion you share directly influences real business decisions.',
    icon: (
      <svg viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
    ),
  },
  {
    title: 'Our Values',
    text: 'Transparency, fairness, and respect for your time. We are committed to protecting your privacy and delivering rewards promptly.',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
  },
]

export default function AboutUs() {
  return (
    <section id="about" className={styles.section}>
      <p className={styles.eyebrow}>About Us</p>
      <h2 className={styles.title}>Who is Surveyflix?</h2>
      <p className={styles.description}>
        We are a European survey panel dedicated to giving consumers a voice. Since our founding,
        we have helped thousands of members earn rewards while helping businesses make better decisions.
      </p>

      <div className={styles.cards}>
        {cards.map((c) => (
          <div key={c.title} className={styles.card}>
            <div className={styles.iconWrap}>{c.icon}</div>
            <h3 className={styles.cardTitle}>{c.title}</h3>
            <p className={styles.cardText}>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
