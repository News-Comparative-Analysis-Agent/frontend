import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { useMainPageData } from '../hooks/useMainPageData'
import { useUserStore } from '../stores/useUserStore'
import LoginModal from '../components/auth/LoginModal'
import { useIssueStore } from '../stores/useIssueStore'

// 하위 컴포넌트 임포트
import MainHero from '../components/main/MainHero'
import MainSearchHeader from '../components/main/MainSearchHeader'
import PublisherNewsSection from '../components/main/PublisherNewsSection'
import PopularIssuesSection from '../components/main/PopularIssuesSection'
import PublisherSidebar from '../components/main/PublisherSidebar'

/**
 * 메인 페이지 (MainPage)
 * - 로직: useMainPageData 커스텀 훅에서 독립적으로 관리
 * - UI: 기능 단위의 서브 컴포넌트로 분폭 (36KB -> 2KB 미만)
 * - 특징: 기존의 모든 애니메이션, 이미지 로테이션 타이머, 필터 상태 완벽 유지
 */
const MainPage = () => {
  const {
    navigate,
    loading,
    error,
    newsData,
    dailyIssues,
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

  // 스크롤 감지 로직 (Scroll Spy)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'section-common') setActiveSection('common')
            if (entry.target.id === 'section-publisher') setActiveSection('publisher')
          }
        })
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' }
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
      const offset = 120 // 헤더 높이 고려
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
    
    // 만약 토큰이 URL에 있다면, 사용자 정보와 함께 로그인 처리
    if (token && !isLoggedIn) {
      console.log('토큰 감지됨, 자동 로그인 진행:', token);
      
      // 사용자 제공 데이터를 기반으로 가상 로그인 처리 (실제 환경에서는 API 호출로 유저 정보 획득)
      const mockUser = {
        nickname: '영호',
        email: 'ajk6068@gmail.com',
        id: 1,
        created_at: '2026-03-03T14:07:55.116938'
      };
      
      login(mockUser, token);
      
      // URL에서 토큰 제거 (깔끔한 UI 유지)
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('access_token');
      newParams.delete('token');
      setSearchParams(newParams);
    }
  }, [searchParams, isLoggedIn, login, setSearchParams]);

  return (
    <Layout>
      <div className="relative">
        {/* 로그인 모달: 비로그인 시 강제 노출 */}
        <LoginModal isOpen={!isLoggedIn} />

        {/* 우측 스티키 내비게이션 (Scroll Spy) - 도트 스타일 디자인 */}
        <aside className="hidden 2xl:block fixed right-10 top-1/2 -translate-y-1/2 z-30">
          <div className="flex flex-col gap-8 items-center pl-4">
            {/* 섹션 01: 언론사 공통 */}
            <div 
              onClick={() => scrollToSection('section-common')}
              className="group cursor-pointer flex items-center justify-end w-40 relative"
            >
              <span className={`mr-4 text-[13px] font-normal transition-all duration-500 ${activeSection === 'common' ? 'text-slate-900 opacity-100 translate-x-0' : 'text-slate-400 opacity-0 translate-x-2'}`}>
                언론사 공통
              </span>
              <div className="relative flex items-center justify-center">
                <div className={`transition-all duration-500 rounded-full border ${activeSection === 'common' ? 'size-6 border-primary/30' : 'size-0 border-slate-900/20'}`}></div>
                <div className={`absolute rounded-full transition-all duration-300 ${activeSection === 'common' ? 'size-1.5 bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'size-1.5 bg-slate-300 group-hover:bg-slate-400'}`}></div>
              </div>
            </div>

            {/* 섹션 02: 각 언론사별 */}
            <div 
              onClick={() => scrollToSection('section-publisher')}
              className="group cursor-pointer flex items-center justify-end w-40 relative"
            >
              <span className={`mr-4 text-[13px] font-normal transition-all duration-500 ${activeSection === 'publisher' ? 'text-slate-900 opacity-100 translate-x-0' : 'text-slate-400 opacity-0 translate-x-2'}`}>
                각 언론사별
              </span>
              <div className="relative flex items-center justify-center">
                <div className={`transition-all duration-500 rounded-full border border-slate-900/20 ${activeSection === 'publisher' ? 'size-6' : 'size-0'}`}></div>
                <div className={`absolute rounded-full transition-all duration-300 ${activeSection === 'publisher' ? 'size-1.5 bg-slate-900' : 'size-1.5 bg-slate-300 group-hover:bg-slate-400'}`}></div>
              </div>
            </div>
          </div>
        </aside>


        {/* 언론사 선택 사이드바 (숨김형) */}
        <PublisherSidebar 
          isOpen={isPublisherSidebarOpen}
          onClose={() => setIsPublisherSidebarOpen(false)}
          allPublishers={allPublishers}
          selectedMedia={selectedMedia}
          handleMediaChange={handleMediaChange}
        />

        <div className={`transition-all duration-1000 ${!isLoggedIn ? 'blur-md pointer-events-none' : 'animate-page-in'}`}>
          {/* 1. Hero 섹션: 프로세스 안내 */}
          <MainHero 
            activeIssueType={activeIssueType} 
            stats={{
              totalArticles: Object.values(newsData[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] || {}).reduce((sum, list) => sum + list.length, 0),
              totalIssues: (dailyIssues?.data?.[`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`] || []).length,
              totalPublishers: allPublishers.length
            }}
          />

          {/* 2. 메인 뉴스 컨텐츠 영역 */}
          <div className="max-w-[1280px] mx-auto px-4 xl:px-6 pb-8 xl:pb-12 pt-6 relative">
            
            {/* 메인 콘텐츠 영역 */}
            <div className="w-full">
              <div className="flex flex-col gap-16">
                
                {/* 상단: 실시간 통합 순위 (전체 너비 사용) */}
                <div id="section-common" className="w-full min-w-0 flex flex-col items-stretch scroll-mt-32">
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
                
                {/* 3. 섹션 구분선 */}
                <div className="w-full h-px bg-slate-200"></div>

                {/* 하단: 언론사별 인기 뉴스 (전체 너비 사용) */}
                <div id="section-publisher" className="w-full min-w-0 scroll-mt-32">
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
        </div>
      </div>
    </Layout>
  )
}

export default MainPage
