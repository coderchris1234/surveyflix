/**
 * Surveys.jsx — Survey listing and interactive survey modal
 *
 * Fetches surveys from GET /Dsurvey on mount.
 * Falls back to FALLBACK_SURVEYS if the API returns nothing or errors.
 *
 * When a survey is completed, calls POST /Dsurvey/:userId/:surveyId
 * and then calls onEarn() to update the points balance in Dashboard.jsx.
 */
import { useState, useEffect } from 'react'
import { getSurveys, completeSurvey, getUser } from '../../api'
import styles from './Surveys.module.css'

// Used if the API returns no surveys or fails
const FALLBACK_SURVEYS = [
  {
    id: '1',
    title: 'Consumer Shopping Habits',
    category: 'Lifestyle',
    duration: '5 min',
    questions: 5,
    pointsPerQ: 20,
    qs: [
      { q: 'How often do you shop online?', opts: ['Daily', 'Weekly', 'Monthly', 'Rarely'] },
      { q: 'What device do you mostly use for online shopping?', opts: ['Smartphone', 'Laptop', 'Tablet', 'Desktop'] },
      { q: 'Which factor matters most when buying online?', opts: ['Price', 'Brand', 'Reviews', 'Delivery speed'] },
      { q: 'How much do you spend online per month?', opts: ['Under €50', '€50–€150', '€150–€300', 'Over €300'] },
      { q: 'Would you recommend online shopping to others?', opts: ['Definitely', 'Probably', 'Not sure', 'No'] },
    ],
  },
  {
    id: '2',
    title: 'Tech Product Feedback',
    category: 'Technology',
    duration: '4 min',
    questions: 4,
    pointsPerQ: 25,
    qs: [
      { q: 'How satisfied are you with your current smartphone?', opts: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
      { q: 'How often do you upgrade your phone?', opts: ['Every year', 'Every 2 years', 'Every 3+ years', 'Only when broken'] },
      { q: 'Which brand do you prefer?', opts: ['Apple', 'Samsung', 'Google', 'Other'] },
      { q: 'What feature matters most to you?', opts: ['Camera', 'Battery life', 'Performance', 'Price'] },
    ],
  },
  {
    id: '3',
    title: 'Travel & Lifestyle Survey',
    category: 'Travel',
    duration: '6 min',
    questions: 6,
    pointsPerQ: 30,
    qs: [
      { q: 'How many times do you travel per year?', opts: ['Never', '1–2 times', '3–5 times', 'More than 5'] },
      { q: 'What type of travel do you prefer?', opts: ['Beach', 'City breaks', 'Adventure', 'Cultural'] },
      { q: 'How do you book your trips?', opts: ['Travel agency', 'Online platform', 'Direct with hotel', 'Friends/family'] },
      { q: 'What is your average travel budget?', opts: ['Under €500', '€500–€1000', '€1000–€2000', 'Over €2000'] },
      { q: 'Do you travel solo or with others?', opts: ['Solo', 'Partner', 'Family', 'Friends'] },
      { q: 'Would you pay for a travel subscription service?', opts: ['Yes', 'Maybe', 'No', 'Already do'] },
    ],
  },
  {
    id: '4',
    title: 'Food & Nutrition Habits',
    category: 'Health',
    duration: '3 min',
    questions: 3,
    pointsPerQ: 15,
    qs: [
      { q: 'How would you describe your diet?', opts: ['Omnivore', 'Vegetarian', 'Vegan', 'Flexitarian'] },
      { q: 'How often do you cook at home?', opts: ['Every day', 'A few times a week', 'Rarely', 'Never'] },
      { q: 'Do you read nutritional labels when shopping?', opts: ['Always', 'Sometimes', 'Rarely', 'Never'] },
    ],
  },
]

export default function Surveys({ onEarn, completedIds }) {
  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)

  // Fetch surveys from API on mount
  useEffect(() => {
    getSurveys()
      .then(res => {
        const data = res.data
        if (Array.isArray(data) && data.length > 0) {
          // Normalise API shape → internal shape the UI expects
          // API: { id, category, title, points, allocatedTime, totalQuestions, questions: [{question, options}] }
          // UI:  { id, category, title, pointsPerQ, duration, questions (count), qs: [{q, opts}] }
          const normalised = data.map(s => ({
            id: s.id,
            title: s.title,
            category: s.category,
            duration: `${s.allocatedTime} min`,
            pointsPerQ: Number(s.points) || 5,
            questions: s.totalQuestions || s.questions?.length || 1,
            qs: Array.isArray(s.questions)
              ? s.questions.map(q => ({
                  q: q.question,
                  opts: Array.isArray(q.options) ? q.options : [],
                }))
              : [],
          }))
          setSurveys(normalised)
        } else {
          setSurveys(FALLBACK_SURVEYS)
        }
      })
      .catch(() => setSurveys(FALLBACK_SURVEYS))
      .finally(() => setLoading(false))
  }, [])

  const openSurvey = (survey) => {
    setActive(survey)
    setQIndex(0)
    setSelected(null)
    setDone(false)
  }

  const handleNext = async () => {
    if (qIndex < (active.qs?.length ?? active.questions) - 1) {
      setQIndex(i => i + 1)
      setSelected(null)
    } else {
      const user = getUser()
      const userId = user?._id || user?.id
      if (userId) {
        completeSurvey(userId, active.id).catch(() => {})
      }
      // Total points = pointsPerQ × number of questions
      const pts = (active.pointsPerQ || 5) * (active.qs?.length || active.questions || 1)
      setDone(true)
      onEarn(active.id, pts)
    }
  }

  const handleClose = () => { setActive(null); setDone(false) }

  // Normalise questions — API may return different shape than fallback
  const getQuestions = (s) => s.qs || []
  const getTotalQ = (s) => s.qs?.length || s.questions || 1
  const getPoints = (s) => (s.questions || s.qs?.length || 1) * (s.pointsPerQ || 20)

  if (loading) {
    return <p style={{ padding: 32, color: '#888', textAlign: 'center' }}>Loading surveys...</p>
  }

  return (
    <>
      <div className={styles.grid}>
        {surveys.map(s => {
          const isCompleted = completedIds.includes(s.id)
          return (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.tag}>{s.category || 'General'}</span>
                <span className={styles.pts}>+{getPoints(s)} pts</span>
              </div>
              <p className={styles.title}>{s.title}</p>
              <div className={styles.meta}>
                <span>⏱ {s.duration || '5 min'}</span>
                <span>❓ {getTotalQ(s)} questions</span>
                <span>🪙 {s.pointsPerQ || 20} pts/q</span>
              </div>
              <button
                className={styles.startBtn}
                onClick={() => openSurvey(s)}
                disabled={isCompleted}
              >
                {isCompleted ? '✓ Completed' : 'Start Survey'}
              </button>
            </div>
          )
        })}
      </div>

      {active && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            {!done ? (
              <>
                <div className={styles.modalHeader}>
                  <p className={styles.modalTitle}>{active.title}</p>
                  <button className={styles.closeBtn} onClick={handleClose}>×</button>
                </div>
                <p className={styles.progress}>Question {qIndex + 1} of {getTotalQ(active)}</p>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${((qIndex + 1) / getTotalQ(active)) * 100}%` }} />
                </div>
                {getQuestions(active)[qIndex] ? (
                  <>
                    <p className={styles.question}>{getQuestions(active)[qIndex].q}</p>
                    <div className={styles.options}>
                      {getQuestions(active)[qIndex].opts.map(opt => (
                        <button
                          key={opt}
                          className={`${styles.option} ${selected === opt ? styles.selected : ''}`}
                          onClick={() => setSelected(opt)}
                        >
                          <span className={styles.optionDot} />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className={styles.question}>Answer this survey question.</p>
                )}
                <button className={styles.nextBtn} onClick={handleNext} disabled={!selected}>
                  {qIndex < getTotalQ(active) - 1 ? 'Next Question →' : 'Submit Survey'}
                </button>
              </>
            ) : (
              <div className={styles.doneBox}>
                <div className={styles.doneIcon}>🎉</div>
                <p className={styles.doneTitle}>Survey Complete!</p>
                <p className={styles.donePoints}>+{getPoints(active)} pts earned</p>
                <button className={styles.doneBtn} onClick={handleClose}>Back to Surveys</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
