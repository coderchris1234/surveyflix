import styles from './Overview.module.css'

const GIFT_TIERS = [
  { amount: '$200', points: 20000 },
  { amount: '$500', points: 50000 },
  { amount: '$700', points: 70000 },
]

// Recent activity will be populated from real survey completions in the future
const recentActivity = []

export default function Overview({ points, completedIds }) {
  const nextTier = GIFT_TIERS.find(t => t.points > points) || GIFT_TIERS[GIFT_TIERS.length - 1]
  const prevTier = GIFT_TIERS.filter(t => t.points <= points).pop()
  const base = prevTier ? prevTier.points : 0
  const pct = Math.min(((points - base) / (nextTier.points - base)) * 100, 100)

  const surveysDone = completedIds?.length ?? 0

  return (
    <>
      {/* Stat cards */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Points</p>
          <p className={styles.statValue}>{points.toLocaleString()}</p>
          <p className={styles.statSub}>Lifetime earned</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Surveys Done</p>
          <p className={styles.statValue}>{surveysDone}</p>
          <p className={styles.statSub}>{surveysDone === 0 ? 'Complete surveys to earn points' : `${surveysDone} completed`}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Next Reward</p>
          <p className={`${styles.statValue} ${styles.accent}`}>{nextTier.amount}</p>
          <p className={styles.statSub}>{(nextTier.points - points).toLocaleString()} pts away</p>
        </div>
      </div>

      {/* Progress */}
      <div className={styles.progressCard}>
        <div className={styles.progressHeader}>
          <p className={styles.progressTitle}>Progress to next gift card</p>
          <span className={styles.progressTarget}>{points.toLocaleString()} / {nextTier.points.toLocaleString()} pts</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.progressLabels}>
          <span>{base.toLocaleString()} pts</span>
          <span>{nextTier.points.toLocaleString()} pts → {nextTier.amount} Gift Card</span>
        </div>

        <div className={styles.milestones}>
          {GIFT_TIERS.map(tier => (
            <div key={tier.amount} className={`${styles.milestone} ${points >= tier.points ? styles.reached : ''}`}>
              {points >= tier.points && <span className={styles.milestoneBadge}>Unlocked</span>}
              <p className={styles.milestoneAmount}>{tier.amount}</p>
              <p className={styles.milestoneLabel}>{tier.points.toLocaleString()} pts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <p className={styles.sectionTitle}>Recent Activity</p>
      <div className={styles.recentList}>
        {recentActivity.length === 0 ? (
          <div className={styles.recentItem} style={{ justifyContent: 'center', color: '#aaa', fontSize: 14 }}>
            No activity yet — complete a survey to get started!
          </div>
        ) : (
          recentActivity.map(a => (
            <div key={a.name} className={styles.recentItem}>
              <div>
                <p className={styles.recentName}>{a.name}</p>
                <p className={styles.recentDate}>{a.date}</p>
              </div>
              <span className={styles.recentPts}>{a.pts} pts</span>
            </div>
          ))
        )}
      </div>
    </>
  )
}
