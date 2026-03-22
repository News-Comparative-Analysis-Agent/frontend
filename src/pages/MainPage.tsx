import Layout from '../layouts/Layout'
import { useMainPageData } from '../hooks/useMainPageData'

// 하위 컴포넌트 임포트
import MainHero from '../components/main/MainHero'
import MainSearchHeader from '../components/main/MainSearchHeader'
import PublisherNewsSection from '../components/main/PublisherNewsSection'
import PopularIssuesSection from '../components/main/PopularIssuesSection'

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
    selectedMedia,
    activePopularTab,
    setActivePopularTab,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    topImageIndex,
    handleMediaChange,
    handleSearch,
    filteredPublishers
  } = useMainPageData()

  return (
    <Layout>
      <div className="animate-page-in">
        {/* 1. Hero 섹션: 프로세스 안내 */}
        <MainHero />

        {/* 2. 검색 및 헤더 섹션 */}
        <MainSearchHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />

        {/* 3. 메인 뉴스 컨텐츠 영역 */}
        <div className="max-w-[1400px] mx-auto px-6 pb-12 pt-6">
          <div className="flex flex-col xl:flex-row gap-4 items-start">
            
            {/* 좌측: 언론사별 인기 뉴스 */}
            <PublisherNewsSection 
              loading={loading}
              error={error}
              newsData={newsData}
              selectedMedia={selectedMedia}
              handleMediaChange={handleMediaChange}
              filteredPublishers={filteredPublishers}
            />

            {/* 우측: 실시간 통합 순위 및 차트아웃 이슈 */}
            <PopularIssuesSection 
              loading={loading}
              dailyIssues={dailyIssues}
              activeTab={activePopularTab}
              setActiveTab={setActivePopularTab}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              topImageIndex={topImageIndex}
              onNavigateToAnalysis={(id) => navigate(`/analysis?id=${id}`)}
            />

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MainPage
