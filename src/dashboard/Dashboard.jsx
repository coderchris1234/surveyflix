/**
 * Dashboard.jsx — User dashboard state manager
 *
 * This is the top-level component for the logged-in user experience.
 * It holds the shared state that multiple dashboard pages need:
 *
 *   - page:         which tab is currently active (overview | surveys | rewards)
 *   - points:       the user's current point balance (starts at 23,500 for demo)
 *   - completedIds: array of survey IDs the user has already completed
 *                   (prevents re-doing the same survey)
 *
 * State is passed DOWN to child pages as props.
 * The Surveys page calls onEarn() when a survey is finished, which updates
 * the points balance here and bubbles up to the topbar badge.
 *
 * NOTE: Points History and My Profile pages are commented out for now.
 * To re-enable them, uncomment the imports and the JSX render lines below.
 */
import { useState } from 'react'
import DashboardLayout from './layout/DashboardLayout'
import Overview from './pages/Overview'
import Surveys from './pages/Surveys'
import Rewards from './pages/Rewards'
// import History from './pages/History'
// import Profile from './pages/Profile'

// Starting demo balance — change this to 0 for a fresh user experience
const INITIAL_POINTS = 23500

export default function Dashboard() {
  const [page, setPage] = useState('overview')
  const [points, setPoints] = useState(INITIAL_POINTS)
  const [completedIds, setCompletedIds] = useState([])

  // Called by Surveys page when a user finishes a survey
  // surveyId is added to completedIds so the button shows "Completed"
  const handleEarn = (surveyId, earned) => {
    setPoints(p => p + earned)
    setCompletedIds(ids => [...ids, surveyId])
  }

  return (
    // DashboardLayout provides the sidebar, topbar, and content area
    // activePage controls which nav item is highlighted
    <DashboardLayout activePage={page} onNavigate={setPage} points={points}>
      {page === 'overview' && <Overview points={points} onNavigate={setPage} />}
      {page === 'surveys'  && <Surveys onEarn={handleEarn} completedIds={completedIds} />}
      {page === 'rewards'  && <Rewards points={points} />}
      {/* {page === 'history'  && <History />} */}
      {/* {page === 'profile'  && <Profile />} */}
    </DashboardLayout>
  )
}
