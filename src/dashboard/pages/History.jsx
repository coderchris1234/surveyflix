import styles from './History.module.css'

const history = [
  { id: 1, type: 'earn',   desc: 'Consumer Shopping Habits',  pts: +100, date: 'Apr 12, 2026' },
  { id: 2, type: 'earn',   desc: 'Tech Product Feedback',     pts: +100, date: 'Apr 10, 2026' },
  { id: 3, type: 'earn',   desc: 'Travel & Lifestyle Survey', pts: +180, date: 'Apr 8, 2026'  },
  { id: 4, type: 'earn',   desc: 'Food & Nutrition Habits',   pts: +45,  date: 'Apr 5, 2026'  },
  { id: 5, type: 'redeem', desc: '$200 Gift Card Claimed',    pts: -20000, date: 'Mar 28, 2026' },
  { id: 6, type: 'earn',   desc: 'Brand Awareness Survey',    pts: +120, date: 'Mar 20, 2026' },
  { id: 7, type: 'earn',   desc: 'Health & Wellness Poll',    pts: +60,  date: 'Mar 15, 2026' },
  { id: 8, type: 'earn',   desc: 'Finance Habits Survey',     pts: +200, date: 'Mar 10, 2026' },
]

export default function History() {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Points</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {history.map(h => (
            <tr key={h.id}>
              <td>{h.desc}</td>
              <td className={styles.date}>{h.date}</td>
              <td className={h.type === 'earn' ? styles.earn : styles.redeem}>
                {h.type === 'earn' ? '+' : ''}{h.pts.toLocaleString()} pts
              </td>
              <td>
                <span className={`${styles.badge} ${h.type === 'earn' ? styles.earnBadge : styles.redeemBadge}`}>
                  {h.type === 'earn' ? 'Earned' : 'Redeemed'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
