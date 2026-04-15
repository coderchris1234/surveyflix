import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, clearUser, loadProgress, saveProgress } from '../api'
import DashboardLayout from './layout/DashboardLayout'
import Overview from './pages/Overview'
import Surveys from './pages/Surveys'
import Rewards from './pages/Rewards'
// import History from './pages/History'
// import Profile from './pages/Profile'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()
  const uid = user?.id || user?._id || user?.email

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
