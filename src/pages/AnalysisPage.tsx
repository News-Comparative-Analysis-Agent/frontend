import { useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import { useAnalysisPageData } from '../hooks/useAnalysisPageData'
import Loader from '../components/ui/Loader'

// 하위 컴포넌트 임포트
import AnalysisHeader from '../components/analysis/AnalysisHeader'
import AnalysisBackground from '../components/analysis/AnalysisBackground'
import AnalysisMediaPerspectives from '../components/analysis/AnalysisMediaPerspectives'
import AnalysisStickyDock from '../components/analysis/AnalysisStickyDock'

/**
 * 심층 이슈 분석 페이지
 * - 로직: useAnalysisPageData 커스텀 훅에서 관리
 * - UI: 기능별 서브 컴포넌트로 분할하여 가독성과 유지보수성 향상
 */
const AnalysisPage = () => {
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id')
  
  // 모든 비즈니스 로직과 상태를 커스텀 훅에서 가져옵니다.
  const {
    viewModel,
    issueImage,
    handleImageLoad,
    loading,
    error,
    activeMedia,
    setActiveMedia,
    navigate
  } = useAnalysisPageData(issueId)

  // 로딩 상태 UI
  if (loading) return (
    <Layout variant="white" activeStep={2} hideFooter>
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Loader 
          size="lg" 
          text="이슈 심층 분석 중..." 
          subText="잠시만 기다려주시면 얽힌 쟁점들을 깔끔하게 요약해 드릴게요"
        />
      </div>
    </Layout>
  )

  // 에러 상태 UI
  if (error || !viewModel) return (
    <Layout variant="white" activeStep={2} hideFooter>
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
        <p className="text-slate-500 font-medium mb-6">{error || '데이터를 찾을 수 없습니다.'}</p>
        <Button onClick={() => navigate('/')}>메인으로 돌아가기</Button>
      </div>
    </Layout>
  )

  return (
    <Layout variant="white" activeStep={2} hideFooter>
      <div className="analysis-global-loader"></div>
      
      {/* 브레드크럼 상단바 */}
      <div className="bg-white border-b border-slate-50 px-4 md:px-8 py-3 shrink-0">
        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400 text-left">
          <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>home</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-800 font-bold">심층 분석</span>
        </div>
      </div>

      <section className="flex-1 w-full animate-page-in overflow-y-auto custom-scrollbar bg-slate-50/30 text-left">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4">
          
          {/* 1. 헤더 영역 (이미지 및 타이틀) */}
          <AnalysisHeader 
            title={viewModel.name}
            issueImage={issueImage}
            mediaRatio={viewModel.mediaRatio}
            handleImageLoad={handleImageLoad}
          />

          {/* 2. 이슈 배경 상세 및 매체 비율 */}
          <AnalysisBackground 
            description={viewModel.description}
            background={viewModel.background}
            coreContentions={viewModel.coreContentions}
            mediaRatio={viewModel.mediaRatio}
            timeline={viewModel.timeline}
          />

          {/* 3. 언론사별 주요 논조 (필터 및 카드 목록) */}
          <AnalysisMediaPerspectives 
            activeMedia={activeMedia}
            setActiveMedia={setActiveMedia}
            uniqueMediaList={viewModel.uniqueMediaList}
            flattenedOpinions={viewModel.opinions}
          />
        </div>
        <div className="h-32"></div>
      </section>

      {/* 4. 하단 스틱키 도크 */}
      <AnalysisStickyDock 
        onDraftStart={() => navigate(`/drafting?id=${issueId}`)} 
      />
    </Layout>
  )
}

export default AnalysisPage
