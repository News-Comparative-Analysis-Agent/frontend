import { Routes, Route } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import AnalysisPage from '../pages/AnalysisPage'
import DraftingPage from '../pages/DraftingPage'
import FinalReviewPage from '../pages/FinalReviewPage'
import SearchResultsPage from '../pages/SearchResultsPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
      <Route path="/drafting" element={<DraftingPage />} />
      <Route path="/final-review" element={<FinalReviewPage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default AppRouter
