import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import HighlightChip from '../components/ui/HighlightChip'
import OpinionCard from '../components/ui/OpinionCard'
import Breadcrumb from '../components/ui/Breadcrumb'
import { fetchIssueAnalysis, fetchDailyIssues } from '../api/issues'
import { fetchTopNewsByPublisher } from '../api/news'
import { IssueAnalysisResponse, PreGeneratedDraft } from '../types/analysis'
import { getColorKeyByIndex } from '../utils/mediaColors'

const AnalysisPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id')
  const [analysisData, setAnalysisData] = useState<IssueAnalysisResponse | null>(null)
  const [parsedDraft, setParsedDraft] = useState<PreGeneratedDraft | null>(null)
  
  // 지능형 이미지 관리를 위한 상태
  const [candidateImages, setCandidateImages] = useState<string[]>([])
  const [imageIndex, setImageIndex] = useState(0)
  const [issueImage, setIssueImage] = useState<string | null>(null)
  const [sourceArticles, setSourceArticles] = useState<Record<string, any[]>>({})
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeMedia, setActiveMedia] = useState('all')
  const [selectedMediaOptions, setSelectedMediaOptions] = useState<string[]>(['한겨레', '경향신문', '조선일보', '중앙일보'])

  useEffect(() => {
    if (!issueId) {
      setError('이슈 ID가 필요합니다.')
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        // 3중 데이터 대조: 분석 데이터, 데일리 이슈, 개별 기사 리스트를 모두 가져옴
        const [analysisRes, issuesRes, newsRes] = await Promise.all([
          fetchIssueAnalysis(issueId),
          fetchDailyIssues(),
          fetchTopNewsByPublisher()
        ])
        
        setAnalysisData(analysisRes)
        setSourceArticles(newsRes)
        
        // 초안 파싱
        if (analysisRes.pre_generated_draft) {
          try {
            const draft = JSON.parse(analysisRes.pre_generated_draft) as PreGeneratedDraft
            setParsedDraft(draft)
          } catch (e) {
            console.error('Failed to parse draft JSON', e)
          }
        }
        
        // 1. 데일리 이슈에서 검색
        const allIssues = [...(issuesRes.top_issues || []), ...(issuesRes.chart_out_issues || [])]
        const matchedIssue = allIssues.find(iss => 
          String(iss.id) === String(issueId) || 
          (analysisRes.name && iss.name.includes(analysisRes.name.substring(0, 10).trim()))
        )
        
        // 2. 전체 뉴스 기사에서 관련 제목으로 검색
        const allArticles = Object.values(newsRes).flat()
        const matchedArticle = allArticles.find(art => 
          (analysisRes.name && (art.title.includes(analysisRes.name.substring(0, 10).trim()) || analysisRes.name.includes(art.title.substring(0, 10).trim())))
        )
        
        // 후보 이미지군 확보 (중복 제거)
        const candidates = Array.from(new Set([
          ...(matchedIssue?.image_urls || []),
          matchedArticle?.image_url,
          ...(analysisRes as any).image_urls || [],
          (analysisRes as any).image_url
        ])).filter(Boolean) as string[]
                          
        setCandidateImages(candidates)
        setImageIndex(0)
        setIssueImage(candidates[0] || null)
        
      } catch (err) {
        console.error('Failed to fetch analysis data:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [issueId])

  // 이미지 로드 시 해상도 체크 및 자동 교체 핸들러
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    // 실제 너비가 너무 작으면(저화질) 다음 후보로 교체
    if (img.naturalWidth < 500 && imageIndex < candidateImages.length - 1) {
      console.log(`Low quality image detected (${img.naturalWidth}px). Switching to next candidate...`);
      const nextIndex = imageIndex + 1;
      setImageIndex(nextIndex);
      setIssueImage(candidateImages[nextIndex]);
    }
  }

  // 헬퍼: URL로 기사 제목 찾기
  const findArticleTitle = (url: string, press: string) => {
    // 1. 해당 언론사 뉴스에서 먼저 찾기
    const mediaNews = sourceArticles[press] || [];
    const found = mediaNews.find((a: any) => a.url === url);
    if (found) return found.title;

    // 2. 전체 뉴스에서 찾기 (혹시 모르니)
    const allArticles = Object.values(sourceArticles).flat();
    const foundGlobal = allArticles.find((a: any) => a.url === url);
    if (foundGlobal) return foundGlobal.title;

    // 3. 대체제: 언론사명 + 원문 기사
    return `${press} 원문 기사`;
  };

  // 1. pre_generated_draft 기반 데이터 매핑
  const draftOpinions = parsedDraft?.contentions.flatMap(contention => 
    contention.media_views.map((view, idx) => ({
      media: view.press,
      color: getColorKeyByIndex(idx),
      title: view.narrative.split('.')[0] + '.',
      analysisTitle: view.claim,
      description: view.narrative,
      sources: [{ 
        title: view.title || findArticleTitle(view.url, view.press), 
        url: view.url 
      }]
    }))
  ) || []

  // 2. claim_cards 기반 데이터 매핑 (Fallback)
  const cardOpinions = (analysisData?.claim_cards ?? []).map((card, idx) => ({
    media: card.press,
    color: getColorKeyByIndex(idx),
    title: card.claim,
    analysisTitle: "보도 내용 및 주장",
    description: card.evidence,
    sources: [{ 
      title: card.title || findArticleTitle(card.url, card.press), 
      url: card.url 
    }]
  }))

  // 우선순위: draftOpinions가 있으면 그것을 사용, 없으면 cardOpinions 사용
  const flattenedOpinions = draftOpinions.length > 0 ? draftOpinions : cardOpinions

  // 유니크한 언론사 목록 추출
  const uniqueMediaList = Array.from(new Set(flattenedOpinions.map(o => o.media)))

  const toggleMediaOption = (media: string) => {
    if (selectedMediaOptions.includes(media)) {
      setSelectedMediaOptions(selectedMediaOptions.filter(m => m !== media))
    } else {
      setSelectedMediaOptions([...selectedMediaOptions, media])
    }
  }

  const allMediaOptions = ['한겨레', '경향신문', '한국일보', '매일경제', '조선일보', '동아일보', '중앙일보']

  const handleAllToggle = () => {
    if (selectedMediaOptions.length === allMediaOptions.length) {
      setSelectedMediaOptions([])
    } else {
      setSelectedMediaOptions(allMediaOptions)
    }
  }

  if (loading) return (
    <Layout variant="white" activeStep={2} hideFooter>
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-slate-500 font-medium">심층 분석 데이터를 불러오는 중...</p>
      </div>
    </Layout>
  )

  if (error || !analysisData) return (
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
      
      <div className="bg-white border-b border-slate-50 px-4 md:px-8 py-3 shrink-0">
        <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400 text-left">
          <span className="material-symbols-outlined text-[16px] cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/')}>home</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-800 font-bold">심층 분석</span>
        </div>
      </div>

      <section className="flex-1 w-full animate-page-in overflow-y-auto custom-scrollbar bg-slate-50/30 text-left">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4">
          
          <header className="relative mb-2 min-h-[170px] flex items-center overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
            {/* 기사 이미지 영역 (하단 New Feature Area 박스 시작점과 위치 동적 일치) */}
            <div className={`absolute inset-y-0 right-0 ${analysisData.media_ratio ? 'w-[35%]' : 'w-[25%]'} z-0 h-full overflow-hidden`}>
              {issueImage && (
                <img 
                  src={issueImage} 
                  alt="Issue Visual Context" 
                  onLoad={handleImageLoad}
                  className="w-full h-full object-cover object-right select-none"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)',
                    maskImage: 'linear-gradient(to right, transparent, black 40%)'
                  }}
                />
              )}
            </div>

            {/* 타이틀 영역 (좌측 배치, 가독성을 위한 레이어 분리) */}
            <div className="relative z-10 flex flex-col gap-2 w-[55%] px-10 py-6 h-full justify-center">
              <SectionHeader 
                title={analysisData.name} 
                badge="현재 단계 : 심층 분석"
                align="left"
                titleSize="page"
                className="mb-0 !drop-shadow-none"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-2">
            <div className={`bg-white border border-slate-100 rounded-[32px] p-8 shadow-premium ${analysisData.media_ratio ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center size-8 bg-primary rounded-full shadow-sm shadow-primary/20">
                  <span className="material-symbols-outlined text-[18px] text-white">subject</span>
                </div>
                <h3 className="text-[20px] font-bold text-slate-900">이슈 배경 상세</h3>
              </div>
              
              <div className="space-y-4 pr-6">
                <div className="bullet-point">
                  <div className="bullet-dot"></div>
                  <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{analysisData.description}</p>
                </div>
                {analysisData.background && (
                  <div className="bullet-point">
                    <div className="bullet-dot"></div>
                    <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{analysisData.background}</p>
                  </div>
                )}
                {analysisData.core_contentions && (
                  <div className="bullet-point">
                    <div className="bullet-dot"></div>
                    <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{analysisData.core_contentions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 신규 기능을 위한 예약용 빈 영역 (플레이스홀더) */}
            <div className="lg:col-span-1 bg-white border border-slate-100 border-dashed rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center group hover:border-primary/30 transition-colors">
              <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
                <span className="material-symbols-outlined text-[40px] mb-3 text-slate-400">add_circle</span>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Feature Area</p>
                <p className="text-[11px] text-slate-300 mt-1">추후 기능 탑재 예정</p>
              </div>
            </div>
            
            {analysisData.media_ratio && (
              <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[32px] p-8 shadow-premium flex flex-col items-center justify-center">
                 <div className="text-center">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">MEDIA RATIO</p>
                   <div className="relative size-32 mb-4">
                     {/* 차트 라이브러리 대신 간단한 시각화 UI */}
                     <div className="absolute inset-0 rounded-full border-[10px] border-slate-100"></div>
                     <div className="absolute inset-0 rounded-full border-[10px] border-primary border-r-transparent border-b-transparent rotate-45"></div>
                   </div>
                   <p className="text-sm font-bold text-slate-800">{analysisData.media_ratio}</p>
                 </div>
              </div>
            )}
          </div>

          <section className="mb-2">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-[#F9FAFB] border border-slate-100 rounded-3xl px-8 py-4 mb-2 gap-8 shadow-sm">
              <div className="flex flex-col gap-1 text-left flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 bg-primary rounded-xl shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-[18px] text-white">newspaper</span>
                  </div>
                  <h3 className="text-[20px] font-bold text-slate-900 tracking-tight whitespace-nowrap">언론사별 주요 논조</h3>
                </div>
                <div className="pl-11">
                  <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                    원하는 언론사의 관점만 골라보세요.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 p-1 bg-slate-200/50 rounded-2xl border border-slate-200/30 shrink-0">
                <button
                  onClick={() => setActiveMedia('all')}
                  className={`px-5 py-2 rounded-xl text-[14px] font-bold transition-all whitespace-nowrap ${
                    activeMedia === 'all'
                      ? 'bg-white text-primary shadow-premium border border-slate-100'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
                  }`}
                >
                  전체
                </button>
                {uniqueMediaList.map(media => (
                  <button
                    key={media}
                    onClick={() => setActiveMedia(media)}
                    className={`px-5 py-2 rounded-xl text-[14px] font-bold transition-all whitespace-nowrap ${
                      activeMedia === media
                        ? 'bg-white text-primary shadow-premium border border-slate-100'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
                    }`}
                  >
                    {media}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="flex gap-6 overflow-x-auto pb-8 pt-0 no-scrollbar scroll-smooth">
                {flattenedOpinions.filter(o => activeMedia === 'all' || o.media === activeMedia).map((o, idx) => (
                  <div key={`${o.media}-${idx}`} className="min-w-[380px] w-[380px] md:min-w-[420px] md:w-[420px] flex-shrink-0">
                    <OpinionCard 
                      media={o.media}
                      color={o.color}
                      title={o.title}
                      analysisTitle={o.analysisTitle}
                      description={o.description}
                      sources={o.sources}
                    />
                  </div>
                ))}
                {flattenedOpinions.length === 0 && (
                   <div className="w-full h-40 flex items-center justify-center text-slate-400 font-medium">
                     해당 언론사의 분석 기사가 없습니다.
                   </div>
                )}
                <div className="min-w-[100px] shrink-0"></div>
              </div>
              
              <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-slate-50/0 via-slate-50/40 to-transparent pointer-events-none z-10 opacity-100 group-hover:opacity-0 transition-opacity"></div>
              
              <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none animate-bounce flex flex-col items-center gap-2 text-primary opacity-80 group-hover:opacity-0 transition-opacity">
                <span className="material-symbols-outlined text-[32px] bg-white/80 rounded-full shadow-lg p-2">arrow_forward_ios</span>
                <span className="text-[11px] font-black bg-white/80 px-2 py-0.5 rounded shadow-sm">옆으로 넘겨보세요</span>
              </div>
            </div>
          </section>
        </div>
        <div className="h-32"></div>
      </section>

      {/* Sticky Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-xl border-t border-slate-200 px-8 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-slate-600 font-medium text-sm tracking-tight text-left">심층 이슈 분석이 모두 완료되었습니다. 분석된 맥락을 바탕으로 바로 초안을 작성할 수 있습니다.</span>
        </div>
        <Button 
          onClick={() => navigate(`/drafting?id=${issueId}`)}
          size="lg"
        >
          초안 작성 시작
        </Button>
      </div>
    </Layout>
  )
}

export default AnalysisPage
