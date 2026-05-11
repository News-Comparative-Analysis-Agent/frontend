import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { useMainPageData } from '../hooks/useMainPageData'
import { useUserStore } from '../stores/useUserStore'
import { useIssueStore } from '../stores/useIssueStore'
import LoginModal from '../components/auth/LoginModal'
import MainHero from '../components/main/MainHero'
import MainSearchHeader from '../components/main/MainSearchHeader'
import PublisherNewsSection from '../components/main/PublisherNewsSection'
import PopularIssuesSection from '../components/main/PopularIssuesSection'
import PublisherSidebar from '../components/main/PublisherSidebar'
import CompactHeaderCalendar from '../components/main/CompactHeaderCalendar'

/**
 * 메인 페이지 (MainPage)
 * - 모든 인위적인 스크롤 스냅 및 효과 제거
 * - 브라우저 기본 스크롤 방식으로 복원
 */
const MainPage = () => {
  const {
    navigate,
    loading,
    error,
    newsData,
    dailyIssues,
    dailyStats,
    allPublishers,
    selectedMedia,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    topImageIndex,
    selectedDate,
    handleDateChange,
    handleMediaChange,
    handleSearch,
    filteredPublishers
  } = useMainPageData()
  const [isPublisherSidebarOpen, setIsPublisherSidebarOpen] = useState(false)
  const { isLoggedIn, login } = useUserStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const { activeIssueType } = useIssueStore()
  const [activeSection, setActiveSection] = useState<'common' | 'publisher'>('common')

  // 스크롤 감지 로직 (Scroll Spy) - 우측 도트 내비게이션 활성화용
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id === 'section-common') setActiveSection('common')
            if (id === 'section-publisher') setActiveSection('publisher')
          }
        })
      },
      { threshold: 0.2, rootMargin: '-10% 0px -10% 0px' }
    )

    const common = document.getElementById('section-common')
    const publisher = document.getElementById('section-publisher')

    if (common) observer.observe(common)
    if (publisher) observer.observe(publisher)

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // 헤더 높이 고려
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // OAuth 리다이렉트 후 토큰 감지 및 자동 로그인 처리
  useEffect(() => {
    const token = searchParams.get('access_token') || searchParams.get('token');
    
    if (token && !isLoggedIn) {
      const mockUser = {
        nickname: '영호',
        email: 'ajk6068@gmail.com',
        id: 1,
        created_at: '2026-03-03T14:07:55.116938'
      };
      login(mockUser, token);
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('access_token');
      newParams.delete('token');
      setSearchParams(newParams);
    }
  }, [searchParams, isLoggedIn, login, setSearchParams]);

  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`

  return (
    <Layout>
      <div className="relative overflow-x-hidden">
        {/* 로그인 모달: 비로그인 시 강제 노출 */}
        <LoginModal isOpen={!isLoggedIn} />

        {/* 우측 스티키 내비게이션 (Scroll Spy) */}
        <aside className="hidden xl:block fixed right-2 2xl:right-4 top-1/2 -translate-y-1/2 z-30">
          <div className="flex flex-col gap-8 items-end">
            <div 
              onClick={() => scrollToSection('section-common')}
              className="group cursor-pointer flex items-center justify-end w-auto relative"
            >
              <span className={`mr-1.5 text-[11px] font-medium transition-all duration-500 ${activeSection === 'common' ? 'text-slate-900 opacity-100 translate-x-0' : 'text-slate-400 opacity-0 translate-x-2'}`}>
                언론사 공통
              </span>
              <div className="relative flex items-center justify-center">
                <div className={`transition-all duration-500 rounded-full border ${activeSection === 'common' ? 'size-5 border-primary/30' : 'size-0 border-slate-900/20'}`}></div>
                <div className={`absolute rounded-full transition-all duration-300 ${activeSection === 'common' ? 'size-1 bg-primary shadow-[0_0_6px_rgba(var(--primary-rgb),0.4)]' : 'size-1 bg-slate-300 group-hover:bg-slate-400'}`}></div>
              </div>
            </div>

            <div 
              onClick={() => scrollToSection('section-publisher')}
              className="group cursor-pointer flex items-center justify-end w-auto relative"
            >
              <span className={`mr-1.5 text-[11px] font-medium transition-all duration-500 ${activeSection === 'publisher' ? 'text-slate-900 opacity-100 translate-x-0' : 'text-slate-400 opacity-0 translate-x-2'}`}>
                각 언론사별
              </span>
              <div className="relative flex items-center justify-center">
                <div className={`transition-all duration-500 rounded-full border border-slate-900/20 ${activeSection === 'publisher' ? 'size-5' : 'size-0'}`}></div>
                <div className={`absolute rounded-full transition-all duration-300 ${activeSection === 'publisher' ? 'size-1 bg-slate-900' : 'size-1 bg-slate-300 group-hover:bg-slate-400'}`}></div>
              </div>
            </div>
          </div>
        </aside>

        <PublisherSidebar 
          isOpen={isPublisherSidebarOpen}
          onClose={() => setIsPublisherSidebarOpen(false)}
          allPublishers={allPublishers}
          selectedMedia={selectedMedia}
          handleMediaChange={handleMediaChange}
        />

        <div className={`transition-all duration-1000 ${!isLoggedIn ? 'blur-md pointer-events-none' : 'animate-page-in'}`}>
          <div className="flex flex-col">
            <MainHero 
              activeIssueType={activeIssueType} 
              dailyStats={dailyStats}
              stats={{
                totalArticles: Object.values(newsData[dateKey] || {}).reduce((sum, list) => sum + list.length, 0),
                totalIssues: (dailyIssues?.data?.[dateKey] || []).length,
                totalPublishers: allPublishers.length
              }}
            />

            <div id="section-common" className="max-w-[1280px] mx-auto px-4 xl:px-6 pt-6 pb-8 w-full">
              <PopularIssuesSection 
                loading={loading}
                dailyIssues={dailyIssues}
                activeIssueType={activeIssueType}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                topImageIndex={topImageIndex}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onNavigateToAnalysis={(id) => navigate(`/analysis?id=${id}`)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
              />
            </div>

            {/* 섹션 간 구분선 */}
            <div className="max-w-[1280px] mx-auto px-4 xl:px-6 w-full">
              <div className="w-full h-px bg-slate-200/80"></div>
            </div>

            <div id="section-publisher" className="max-w-[1280px] mx-auto px-4 xl:px-6 pt-8 pb-24 w-full">
              <PublisherNewsSection 
                loading={loading}
                error={error}
                newsData={newsData}
                activeIssueType={activeIssueType}
                allPublishers={allPublishers}
                selectedMedia={selectedMedia}
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                handleMediaChange={handleMediaChange}
                filteredPublishers={filteredPublishers}
                onOpenFilter={() => setIsPublisherSidebarOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MainPage
