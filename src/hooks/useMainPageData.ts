import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTopNewsByPublisher } from '../api/news'
import { fetchDailyIssues } from '../api/issues'
import { NewsArticle } from '../types'
import { DailyIssuesResponse } from '../types/issues'

export const PUBLISHER_ORDER = ['조선일보', '한겨레', '경향신문', '동아일보', '연합뉴스']

export const useMainPageData = () => {
  const navigate = useNavigate()
  const [selectedMedia, setSelectedMedia] = useState<string[]>(PUBLISHER_ORDER)
  const [activePopularTab, setActivePopularTab] = useState<'integrated' | 'chartout'>('integrated')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [newsData, setNewsData] = useState<Record<string, NewsArticle[]>>({})
  const [dailyIssues, setDailyIssues] = useState<DailyIssuesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topImageIndex, setTopImageIndex] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
  }, [activePopularTab])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [newsResponse, issuesResponse] = await Promise.all([
          fetchTopNewsByPublisher(),
          fetchDailyIssues()
        ])
        
        setNewsData(newsResponse)
        setDailyIssues(issuesResponse)
      } catch (e) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 통합 인기 1위 이미지 자동 로테이션 타이머
  useEffect(() => {
    if (!dailyIssues || dailyIssues.top_issues.length === 0 || activePopularTab !== 'integrated') {
      setTopImageIndex(0);
      return;
    }

    const currentIssue = dailyIssues.top_issues[0];
    const images = currentIssue.image_urls || [];
    
    if (images.length <= 1) {
      setTopImageIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setTopImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [dailyIssues, activePopularTab]);

  const handleMediaChange = useCallback((media: string) => {
    if (media === '전체') {
      setSelectedMedia((prev) => prev.length === 5 ? [] : [...PUBLISHER_ORDER])
      return
    }
    setSelectedMedia((prev) => {
      if (prev.includes(media)) {
        return prev.filter(m => m !== media)
      } else {
        return [...prev, media]
      }
    })
  }, [])

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }, [navigate, searchQuery])

  const filteredPublishers = PUBLISHER_ORDER.filter(p => selectedMedia.includes(p))

  return {
    navigate,
    selectedMedia,
    setSelectedMedia,
    activePopularTab,
    setActivePopularTab,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    newsData,
    dailyIssues,
    loading,
    error,
    topImageIndex,
    handleMediaChange,
    handleSearch,
    filteredPublishers
  }
}
