import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { useMainPageData } from '../hooks/useMainPageData'
import { useUserStore } from '../stores/useUserStore'
import LoginModal from '../components/auth/LoginModal'

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

        {/* 좌측 플로팅 탭 버튼 */}
        <div 
          onClick={() => setIsPublisherSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 group cursor-pointer"
        >
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 border-l-0 rounded-r-2xl py-6 px-1.5 shadow-2xl shadow-slate-200 hover:pr-4 transition-all duration-300 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] group-hover:scale-110 transition-transform">filter_list</span>
            <span className="text-[11px] font-black text-slate-800 [writing-mode:vertical-lr] tracking-widest group-hover:text-primary">
              언론사 필터
            </span>
          </div>
        </div>

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
          <MainHero />

          {/* 2. 주간 트렌드 헤더 (검색 기능 제거됨) */}
          <MainSearchHeader 
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />

          {/* 3. 메인 뉴스 컨텐츠 영역 */}
          <div className="max-w-[1280px] mx-auto px-6 pb-12 pt-1">
            <div className="flex flex-col md:flex-row gap-8">
              
              {/* 좌측: 언론사별 인기 뉴스 (3열 구성을 위해 더 넓게 배치) */}
              <div className="w-full md:flex-[2.3] min-w-0">
                <PublisherNewsSection 
                  loading={loading}
                  error={error}
                  newsData={newsData}
                  allPublishers={allPublishers}
                  selectedMedia={selectedMedia}
                  selectedDate={selectedDate}
                  onDateChange={handleDateChange}
                  handleMediaChange={handleMediaChange}
                  filteredPublishers={filteredPublishers}
                />
              </div>

              {/* 우측: 실시간 통합 순위 (슬림하게 배치) */}
              <div className="w-full md:flex-1 min-w-0">
                <PopularIssuesSection 
                  loading={loading}
                  dailyIssues={dailyIssues}
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

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MainPage
