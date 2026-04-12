import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTopNewsByPublisher } from '../api/news'
import { fetchDailyIssues } from '../api/issues'
import { NewsArticle } from '../types'
import { DailyIssuesResponse } from '../types/issues'

export const PUBLISHER_ORDER = ['조선일보', '한겨레', '경향신문', '동아일보', '연합뉴스']

// API 장애 시 화면을 복구하기 위한 가짜 데이터
const MOCK_DAILY_ISSUES: DailyIssuesResponse = {
  data: {
    '2026-04-12': [
      {
        "id": 101,
        "name": "임시 데이터: 백엔드 API 연동 성공 대기 중",
        "description": "API 구조 변경으로 인해 가짜 데이터를 표시하고 있습니다.",
        "article_count": 52,
        "rank": 1,
        "created_at": new Date().toISOString(),
        "image_urls": ["https://images.unsplash.com/photo-1585829365234-781fcd0d43ac?q=80&w=800&auto=format&fit=crop"],
      }
    ]
  }
};

export const useMainPageData = () => {
  const navigate = useNavigate()
  const [selectedMedia, setSelectedMedia] = useState<string[]>(PUBLISHER_ORDER)
  const [activePopularTab, setActivePopularTab] = useState<'integrated' | 'chartout'>('integrated')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [newsData, setNewsData] = useState<Record<string, Record<string, NewsArticle[]>>>({})
  const [dailyIssues, setDailyIssues] = useState<DailyIssuesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topImageIndex, setTopImageIndex] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
  }, [activePopularTab, selectedDate])

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [newsResponse, issuesResponse] = await Promise.all([
          fetchTopNewsByPublisher().catch(() => ({})),
          fetchDailyIssues().catch((err) => {
            console.warn('API 호출 실패, Mock 사용:', err);
            return MOCK_DAILY_ISSUES;
          })
        ])
        
        const validNews = newsResponse?.data || {};
        setNewsData(validNews);

        // 새로운 데이터 구조 { data: { "YYYY-MM-DD": [] } } 검증
        const isValidIssues = issuesResponse && 
                             typeof issuesResponse.data === 'object';

        if (!isValidIssues) {
           console.warn('API 응답 형식이 유효하지 않음, Mock 사용');
           setDailyIssues(MOCK_DAILY_ISSUES);
        } else {
           setDailyIssues(issuesResponse);
        }
      } catch (e) {
        setError('데이터를 불러오는 중 오류가 발생했습니다. 임시 데이터를 표시합니다.')
        setDailyIssues(MOCK_DAILY_ISSUES);
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedDate])

  // 통합 인기 1위 이미지 자동 로테이션 타이머
  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const issuesForDate = dailyIssues?.data?.[dateStr] || [];
    
    if (issuesForDate.length === 0 || activePopularTab !== 'integrated') {
      setTopImageIndex(0);
      return;
    }

    const currentIssue = issuesForDate[0];
    const images = currentIssue?.image_urls || [];
    
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
    selectedDate,
    handleDateChange,
    handleMediaChange,
    handleSearch,
    filteredPublishers
  }
}

