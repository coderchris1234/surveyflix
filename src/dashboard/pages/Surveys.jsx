import { useState } from 'react'
import styles from './Surveys.module.css'

const SURVEYS = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
  const [active, setActive] = useState(null)   // active survey
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)

  const openSurvey = (survey) => {
    setActive(survey)
    setQIndex(0)
    setSelected(null)
    setDone(false)
  }

  const handleNext = () => {
    if (qIndex < active.qs.length - 1) {
      setQIndex(i => i + 1)
      setSelected(null)
    } else {
      setDone(true)
      onEarn(active.id, active.questions * active.pointsPerQ)
    }
  }

  const handleClose = () => {
    setActive(null)
    setDone(false)
  }

  return (
    <>
      <div className={styles.grid}>
        {SURVEYS.map(s => {
          const isCompleted = completedIds.includes(s.id)
          return (
            <div key={s.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.tag}>{s.category}</span>
                <span className={styles.pts}>+{s.questions * s.pointsPerQ} pts</span>
              </div>
              <p className={styles.title}>{s.title}</p>
              <div className={styles.meta}>
                <span>⏱ {s.duration}</span>
                <span>❓ {s.questions} questions</span>
                <span>🪙 {s.pointsPerQ} pts/q</span>
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

      {/* Survey modal */}
      {active && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            {!done ? (
              <>
                <div className={styles.modalHeader}>
                  <p className={styles.modalTitle}>{active.title}</p>
                  <button className={styles.closeBtn} onClick={handleClose}>×</button>
                </div>
                <p className={styles.progress}>Question {qIndex + 1} of {active.qs.length}</p>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${((qIndex + 1) / active.qs.length) * 100}%` }} />
                </div>
                <p className={styles.question}>{active.qs[qIndex].q}</p>
                <div className={styles.options}>
                  {active.qs[qIndex].opts.map(opt => (
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
                <button className={styles.nextBtn} onClick={handleNext} disabled={!selected}>
                  {qIndex < active.qs.length - 1 ? 'Next Question →' : 'Submit Survey'}
                </button>
              </>
            ) : (
              <div className={styles.doneBox}>
                <div className={styles.doneIcon}>🎉</div>
                <p className={styles.doneTitle}>Survey Complete!</p>
                <p className={styles.donePoints}>+{active.questions * active.pointsPerQ} pts earned</p>
                <button className={styles.doneBtn} onClick={handleClose}>Back to Surveys</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
