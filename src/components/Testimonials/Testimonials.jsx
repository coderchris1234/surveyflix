import styles from './Testimonials.module.css'

// flagcdn.com provides accurate SVG/PNG flags by ISO 3166-1 alpha-2 code
const testimonials = [
  {
    id: 1,
    name: 'Sophie Müller',
    country: 'de', // Germany
    avatar: 'https://i.pravatar.cc/150?img=47',
    quote:
      "It's the best survey platform. Surveyflix has been financially beneficial. I've earned money through their surveys. It's the best survey website, legitimate and rewarding.",
  },
  {
    id: 2,
    name: 'Lucas Dupont',
    country: 'fr', // France
    avatar: 'https://i.pravatar.cc/150?img=52',
    quote:
      'The experience I have had on this platform has been very good, the surveys are legit, everything is legal, they comply with their policies. The help desk response is on time. Long live Surveyflix!!!',
  },
  {
    id: 3,
    name: 'Elena Rossi',
    country: 'it', // Italy
    avatar: 'https://i.pravatar.cc/150?img=32',
    quote:
      'I love Surveyflix! I joined them 2 years ago and I will NEVER leave!! Thank you Surveyflix for making taking surveys such a happy experience! Your rewards are amazing and always delivered super fast!',
  },
]

export default function Testimonials() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Panel testimonials</h2>
      <p className={styles.subtitle}>What people say about us....</p>

      <div className={styles.grid}>
        {testimonials.map((t) => (
          <div key={t.id} className={styles.card}>
            <div className={styles.quoteBody}>
              <span className={styles.quoteIcon}>&ldquo;</span>
              <p className={styles.quoteText}>{t.quote}</p>
            </div>

            <p className={styles.name}>{t.name}</p>

            <div className={styles.flagWrapper}>
              <img
                src={`https://flagcdn.com/w320/${t.country}.png`}
                alt={`${t.country.toUpperCase()} flag`}
                className={styles.flag}
              />
              <img
                src={t.avatar}
                alt={t.name}
                className={styles.avatar}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
