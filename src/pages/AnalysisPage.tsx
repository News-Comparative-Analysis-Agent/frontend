import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import HighlightChip from '../components/ui/HighlightChip'
import OpinionCard from '../components/ui/OpinionCard'
import Breadcrumb from '../components/ui/Breadcrumb'
import { fetchIssueAnalysis } from '../api/issues'
import { IssueAnalysisResponse, PreGeneratedDraft } from '../types/analysis'
import { getColorKeyByIndex } from '../utils/mediaColors'

const AnalysisPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const issueId = searchParams.get('id') || '3'

  const [analysisData, setAnalysisData] = useState<IssueAnalysisResponse | null>(null)
  const [parsedDraft, setParsedDraft] = useState<PreGeneratedDraft | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeMedia, setActiveMedia] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMediaOptions, setSelectedMediaOptions] = useState<string[]>(['한겨레', '경향신문', '조선일보', '중앙일보'])

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true)
        const data = await fetchIssueAnalysis(issueId)
        setAnalysisData(data)
        
        if (data.pre_generated_draft) {
          try {
            const draft = JSON.parse(data.pre_generated_draft) as PreGeneratedDraft
            setParsedDraft(draft)
          } catch (e) {
            console.error('Failed to parse draft JSON', e)
          }
        }
      } catch (e) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadAnalysis()
  }, [issueId])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isModalOpen])

  // 1. pre_generated_draft 기반 데이터 매핑
  const draftOpinions = parsedDraft?.contentions.flatMap(contention => 
    contention.media_views.map((view, idx) => ({
      media: view.press,
      color: getColorKeyByIndex(idx),
      title: view.narrative.split('.')[0] + '.',
      analysisTitle: view.claim,
      description: view.narrative,
      sources: [view.url]
    }))
  ) || []

  // 2. claim_cards 기반 데이터 매핑 (Fallback)
  const cardOpinions = (analysisData?.claim_cards ?? []).map((card, idx) => ({
    media: card.press,
    color: getColorKeyByIndex(idx),
    title: card.claim,
    analysisTitle: "보도 내용 및 주장",
    description: card.evidence,
    sources: [card.url]
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
      <Breadcrumb items={['심층 분석', analysisData.name]} />

      <section className="flex-1 w-full py-6 md:py-8 animate-page-in overflow-y-auto custom-scrollbar min-h-0">
        <div className="max-w-[1400px] mx-auto px-6">
        <header className="mb-8 text-center max-w-5xl mx-auto">
          <SectionHeader 
            title={analysisData.name} 
            badge="현재 단계 : 심층 분석"
            align="center"
            titleSize="page"
            className="mb-4"
          />
          <p className="text-slate-500 text-[15px] font-medium leading-relaxed max-w-3xl mx-auto">
            언론사별 시각차 분석
          </p>
        </header>

        <section className={`max-w-[1400px] mx-auto mb-1 ${analysisData.media_ratio ? 'grid grid-cols-1 lg:grid-cols-4 gap-8' : 'block'} bg-white border border-slate-100 rounded-2xl md:rounded-[32px] p-6 md:p-8 shadow-premium`}>
          <div className={`${analysisData.media_ratio ? 'lg:col-span-3' : 'w-full'} text-left`}>
            <div className="flex items-center gap-2 mb-6 text-primary">
              <span className="material-symbols-outlined text-[24px]">subject</span>
              <h3 className="text-[20px] font-bold text-slate-900">이슈 배경 상세</h3>
            </div>
            <div className="space-y-4 pr-6">
              <div className="bullet-point">
                <div className="bullet-dot"></div>
                <p className="text-[15px] text-slate-600 leading-relaxed font-medium max-w-[1050px]">{analysisData.description}</p>
              </div>
              <div className="bullet-point">
                <div className="bullet-dot"></div>
                <p className="text-[15px] text-slate-600 leading-relaxed font-medium max-w-[1050px]">{analysisData.background}</p>
              </div>
              <div className="bullet-point">
                <div className="bullet-dot"></div>
                <p className="text-[15px] text-slate-600 leading-relaxed font-medium max-w-[1050px]">{analysisData.core_contentions}</p>
              </div>
            </div>
          </div>
          {/* 이슈 타임라인은 데이터가 없으므로 생략 (사용자 요청) */}
        </section>

        <div className="max-w-[1400px] mx-auto border-t border-slate-100 my-1"></div>

        <section className="max-w-[1400px] mx-auto mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-[#F9FAFB] border border-slate-100 rounded-3xl px-8 pt-6 pb-2 mb-0 gap-8">
            <div className="flex flex-col gap-1.5 text-left flex-1">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[24px] text-primary">newspaper</span>
                <h3 className="text-[20px] font-bold text-slate-900 tracking-tight whitespace-nowrap">언론사별 주요 논조</h3>
              </div>
              {/* 논조 비율 정보는 사용자 요청으로 제외 가능하지만, 안내 텍스트로 대체 */}
              <div className="w-full mt-2 bg-white px-5 py-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <p className="text-[14px] text-slate-700 font-medium truncate">
                  AI가 분석한 각 언론사별 핵심 주장과 근거를 확인해보세요.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-start gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm shrink-0 mt-[-4px]">
              <span className="text-[12px] font-bold text-slate-500 mr-1 tracking-tight">원하는 언론사의 관점만 골라보세요</span>
              <div className="flex items-center gap-1.5 scroll-smooth overflow-x-auto no-scrollbar max-w-[500px]">
                <button
                  onClick={() => setActiveMedia('all')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                    activeMedia === 'all'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-400 bg-slate-50 hover:text-slate-600'
                  }`}
                >
                  전체
                </button>
                {uniqueMediaList.map(media => (
                  <button
                    key={media}
                    onClick={() => setActiveMedia(media)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                      activeMedia === media
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-slate-400 bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    {media}
                  </button>
                ))}
              </div>
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
              {/* 여백용 투명 요소 */}
              <div className="min-w-[100px] shrink-0"></div>
            </div>
            
            {/* 좌우 페이드 인디케이터 */}
            <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none z-10 opacity-100 group-hover:opacity-0 transition-opacity"></div>
            
            {/* 스크롤 가이드 */}
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
          <span className="text-slate-600 font-medium text-sm tracking-tight">심층 이슈 분석이 모두 완료되었습니다. 분석된 맥락을 바탕으로 바로 초안을 작성할 수 있습니다.</span>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
        >
          초안 작성 시작
        </Button>
      </div>

      {/* Modal Overlay & Content */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[5000] flex items-center justify-center p-4 animate-page-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[580px] overflow-hidden flex flex-col animate-modal-up">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <p className="text-slate-900 text-[20px] font-bold tracking-tight text-left">작성할 초안의 가이드를 잡아주세요</p>
              <Button 
                variant="ghost" 
                size="icon" 
                icon="close"
                onClick={() => setIsModalOpen(false)} 
                className="size-9 rounded-full"
              />
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">기사 카테고리</label>
                  <div className="relative">
                    <select className="w-full h-12 pl-4 pr-10 rounded-lg border-2 border-slate-100 bg-slate-50 text-slate-800 font-medium focus:border-primary focus:ring-0 appearance-none text-sm">
                      <option value="politics">정치</option>
                      <option value="economy">경제</option>
                      <option value="society">사회</option>
                      <option value="it">IT / 과학</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">목표 분량</label>
                  <div className="flex flex-col gap-2.5 px-1 py-1">
                    {['short', 'general', 'deep'].map(len => (
                      <label key={len} className="flex items-center gap-2.5 cursor-pointer text-slate-700 font-medium text-sm whitespace-nowrap">
                        <input className="w-5 h-5 border-2 border-slate-300 text-primary focus:ring-primary focus:ring-offset-0" name="length" type="radio" value={len} defaultChecked={len === 'general'} />
                        <span>{len === 'short' ? '단신 (500자 내외)' : (len === 'general' ? '일반 (1000자 내외)' : '심층 (2000자 이상)')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">인용할 언론사 관점 및 소스 선택</label>
                  <button onClick={handleAllToggle} className="text-[10px] font-bold text-primary hover:underline">
                    {selectedMediaOptions.length === allMediaOptions.length ? '전체 해제' : '전체 선택'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { type: '진보', color: 'text-progressive', bg: 'bg-blue-50', list: ['한겨레', '경향신문'] },
                    { type: '중립', color: 'text-slate-400', bg: 'bg-slate-100', list: ['한국일보', '매일경제'] },
                    { type: '보수', color: 'text-conservative', bg: 'bg-red-50', list: ['조선일보', '동아일보', '중앙일보'] }
                  ].map(group => (
                    <div key={group.type} className="space-y-2">
                      <div className={`text-[10px] font-bold ${group.color} px-1.5 py-0.5 ${group.bg} rounded w-fit uppercase mb-1`}>{group.type}</div>
                      <div className="flex flex-col gap-1.5">
                        {group.list.map(media => (
                          <div
                            key={media}
                            onClick={() => toggleMediaOption(media)}
                            className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                              selectedMediaOptions.includes(media)
                                ? 'border-primary bg-primary/5 text-primary font-bold'
                                : 'border-slate-100 bg-slate-50 text-slate-500 font-medium hover:border-slate-200'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {selectedMediaOptions.includes(media) ? 'check_box' : 'check_box_outline_blank'}
                            </span>
                            <span className="text-[12px]">{media}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-[28px] border-t border-slate-50">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">magic_button</span>
                  <span className="text-[12px] font-medium tracking-tight">AI가 설정된 가이드에 따라 최적의 초안을 구성합니다.</span>
                </div>
                <Button 
                  onClick={() => navigate('/drafting')}
                  size="lg"
                  className="px-10"
                >
                  초안 작성 시작
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default AnalysisPage
