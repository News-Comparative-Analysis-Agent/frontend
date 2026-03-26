import { createBrowserRouter } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import AnalysisPage from '../pages/AnalysisPage'
import DraftingPage from '../pages/DraftingPage'
import FinalReviewPage from '../pages/FinalReviewPage'
import SearchResultsPage from '../pages/SearchResultsPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import MyPage from '../pages/MyPage'

export const router = createBrowserRouter([
  { path: "/", element: <MainPage /> },
  { path: "/analysis", element: <AnalysisPage /> },
  { path: "/drafting", element: <DraftingPage /> },
  { path: "/final-review", element: <FinalReviewPage /> },
  { path: "/search", element: <SearchResultsPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/mypage", element: <MyPage /> },
])
