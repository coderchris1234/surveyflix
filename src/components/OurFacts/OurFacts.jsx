import styles from './OurFacts.module.css'

const fans = [
  { name: 'Victor Kipkoech', country: 'de', avatar: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Aisha Ladidi',    country: 'it', avatar: 'https://i.pravatar.cc/150?img=21' },
  { name: 'Lucy Wanjiru',    country: 'fr', avatar: 'https://i.pravatar.cc/150?img=44' },
  { name: 'Amos Koskei',     country: 'es', avatar: 'https://i.pravatar.cc/150?img=15' },
]

const stats = [
  { value: '500k',    label: 'Total panel' },
  { value: '5k',      label: 'Daily visitors' },
  { value: '7+',      label: 'Countries' },
  { value: '10215',   label: 'Completed surveys' },
  { value: '5125418', label: 'Responses received' },
  { value: '50m',     label: 'Points redeemed' },
]

// random confetti dots config
const dots = [
  { top: '10%',  left: '5%',  color: '#e50914', rotate: '20deg' },
  { top: '20%',  left: '15%', color: '#f5c518', rotate: '45deg' },
  { top: '5%',   left: '40%', color: '#3b82f6', rotate: '10deg' },
  { top: '30%',  left: '55%', color: '#22c55e', rotate: '60deg' },
  { top: '50%',  left: '8%',  color: '#f97316', rotate: '30deg' },
  { top: '60%',  left: '30%', color: '#a855f7', rotate: '15deg' },
  { top: '70%',  left: '60%', color: '#e50914', rotate: '50deg' },
  { top: '80%',  left: '20%', color: '#f5c518', rotate: '70deg' },
  { top: '15%',  left: '70%', color: '#3b82f6', rotate: '25deg' },
  { top: '45%',  left: '80%', color: '#22c55e', rotate: '40deg' },
  { top: '85%',  left: '75%', color: '#f97316', rotate: '55deg' },
  { top: '90%',  left: '45%', color: '#a855f7', rotate: '80deg' },
]

export default function OurFacts() {
  return (
    <section className={styles.section}>
      {/* Left: top fan */}
      <div className={styles.topFan}>
        <p className={styles.topFanTitle}>surveyflix top fan</p>
        <p className={styles.topFanMonth}>March 2026</p>
        <p className={styles.congrats}>Congratulations</p>

        {/* confetti */}
        <div className={styles.confetti}>
          {dots.map((d, i) => (
            <span
              key={i}
              className={styles.dot}
              style={{ top: d.top, left: d.left, background: d.color, transform: `rotate(${d.rotate})` }}
            />
          ))}
        </div>

        <div className={styles.fanList}>
          {fans.map((f) => (
            <div key={f.name} className={styles.fanItem}>
              <img src={f.avatar} alt={f.name} className={styles.fanAvatar} />
              <img
                src={`https://flagcdn.com/w40/${f.country}.png`}
                alt={f.country}
                className={styles.fanFlag}
              />
              <span className={styles.fanName}>{f.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: stats */}
      <div className={styles.right}>
        <h2 className={styles.factsTitle}>Our facts</h2>
        <div className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
