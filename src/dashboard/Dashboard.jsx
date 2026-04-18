/**
 * Dashboard.jsx — User dashboard state manager
 *
 * Reads the logged-in user from localStorage (saved by Login.jsx).
 * Redirects to /login if no user is found.
 *
 * Holds shared state for all dashboard pages:
 *   - page:         active tab (overview | surveys | rewards)
 *   - points:       user's current point balance
 *   - completedIds: survey IDs the user has already completed
 *
 * Points and completedIds are persisted to localStorage per user ID
 * (key: sf_progress_{userId}) so they survive sign out / sign in.
 *
 * The Surveys page calls onEarn(surveyId, pts) when a survey is finished,
 * which updates points here and flows up to the topbar badge.
 *
 * Pages currently active: Overview, Surveys, Rewards
 * Commented-out pages (uncomment to re-enable):
 *   History (Points History), Profile (My Profile)
 */
import { useNavigate } from 'react-router-dom'
import { getUser, clearUser, loadProgress, saveProgress } from '../api'
import DashboardLayout from './layout/DashboardLayout'
import Overview from './pages/Overview'
import Surveys from './pages/Surveys'
import Rewards from './pages/Rewards'
import { useEffect, useState } from 'react'
// import History from './pages/History'
// import Profile from './pages/Profile'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()
  // Backend uses _id (MongoDB ObjectId)
  const uid = user?._id || user?.id || user?.email

  const saved = uid ? loadProgress(uid) : { points: 0, completedIds: [] }

  const [page, setPage] = useState('overview')
  const [points, setPoints] = useState(saved.points)
  const [completedIds, setCompletedIds] = useState(saved.completedIds)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  // Persist progress whenever points or completedIds change
  useEffect(() => {
    if (uid) saveProgress(uid, points, completedIds)
  }, [points, completedIds, uid])

  const handleEarn = (surveyId, earned) => {
    setPoints(p => p + earned)
    setCompletedIds(ids => [...ids, surveyId])
  }

  const handleLogout = () => {
    clearUser()
    navigate('/')
  }

  if (!user) return null

  return (
    <DashboardLayout activePage={page} onNavigate={setPage} points={points} user={user} onLogout={handleLogout}>
      {page === 'overview' && <Overview points={points} user={user} completedIds={completedIds} />}
      {page === 'surveys'  && <Surveys onEarn={handleEarn} completedIds={completedIds} />}
      {page === 'rewards'  && <Rewards points={points} user={user} />}
      {/* {page === 'history'  && <History />} */}
      {/* {page === 'profile'  && <Profile />} */}
    </DashboardLayout>
  )
}
