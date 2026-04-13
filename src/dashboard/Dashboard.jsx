import { useState } from 'react'
import DashboardLayout from './layout/DashboardLayout'
import Overview from './pages/Overview'
import Surveys from './pages/Surveys'
import Rewards from './pages/Rewards'
import History from './pages/History'
import Profile from './pages/Profile'

const INITIAL_POINTS = 23500

export default function Dashboard() {
  const [page, setPage] = useState('overview')
  const [points, setPoints] = useState(INITIAL_POINTS)
  const [completedIds, setCompletedIds] = useState([])

  const handleEarn = (surveyId, earned) => {
    setPoints(p => p + earned)
    setCompletedIds(ids => [...ids, surveyId])
  }

  return (
    <DashboardLayout activePage={page} onNavigate={setPage} points={points}>
      {page === 'overview' && <Overview points={points} onNavigate={setPage} />}
      {page === 'surveys'  && <Surveys onEarn={handleEarn} completedIds={completedIds} />}
      {page === 'rewards'  && <Rewards points={points} />}
      {page === 'history'  && <History />}
      {page === 'profile'  && <Profile />}
    </DashboardLayout>
  )
}
