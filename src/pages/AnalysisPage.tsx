import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { opinions } from '../mocks/newsData'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import HighlightChip from '../components/ui/HighlightChip'
import OpinionCard from '../components/ui/OpinionCard'
import Breadcrumbs from '../components/ui/Breadcrumbs'

const AnalysisPage = () => {
  const navigate = useNavigate()
  const [activeStance, setActiveStance] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMediaOptions, setSelectedMediaOptions] = useState<string[]>(['한겨레', '경향신문', '한국일보'])

  const breadcrumbItems = [
    { label: '심층 분석', isLast: false },
    { label: '민주당-혁신당 합당 논란', isLast: true }
  ]

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [isModalOpen])

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

  return (
    <Layout variant="primary" activeStep={2} hideFooter>
      <div className="analysis-global-loader"></div>
      <Breadcrumbs items={breadcrumbItems} />

      <section className="flex-1 w-full py-8 md:py-12 animate-page-in overflow-y-auto custom-scrollbar min-h-0">
        <div className="page-container">
          <header className="mb-12 text-center max-w-5xl mx-auto">
            <SectionHeader 
              title="이슈 심층분석: 더불어민주당-조국혁신당 합당 추진 중단 및 당내 내홍" 
              align="center"
              titleSize="page"
              className="mb-4"
            />
            <p className="text-slate-500 text-[15px] font-medium leading-relaxed max-w-3xl mx-auto">
              정청래 대표의 합당 드라이브와 19일 만의 중단 결정, 언론사별 시각차 분석
            </p>
          </header>

          <section className="max-w-[1240px] mx-auto mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8 card-premium">
            <div className="lg:col-span-2 text-left">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <span className="material-symbols-outlined text-[24px]">subject</span>
                <h3 className="text-[20px] font-bold text-slate-900">이슈 배경 상세</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                <HighlightChip label="핵심:" value="19일 만의 합당 논의 중단" />
                <HighlightChip label="발단:" value="정청래 대표의 기습 제안" />
                <HighlightChip label="쟁점:" value="당내 민주주의 및 권력 투쟁" />
              </div>
              <div className="space-y-4 pr-6">
                {[
                  "지난달 22일 정청래 대표가 최고위와 상의 없이 조국혁신당에 합당을 기습 제안하며 촉발된 사안입니다.",
                  "당내 의원 패싱, 문건 유출 논란 등으로 계파 간 갈등이 격화되었고, 결국 19일 만에 논의를 중단하기로 결정했습니다.",
                  "언론계는 이를 정 대표의 리더십 위기로 규정하거나, 차기 당권과 공천권을 둘러싼 여권 내부의 '내부 권력 투쟁'으로 분석하고 있습니다."
                ].map((text, i) => (
                  <div key={i} className="bullet-point">
                    <div className="bullet-dot"></div>
                    <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1 bg-slate-50/50 rounded-2xl p-6 text-left">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <span className="material-symbols-outlined text-[22px]">trending_up</span>
                <h4 className="text-[17px] font-bold">언론 노출 트렌드</h4>
              </div>
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-bold text-slate-500">전일 대비 관련 기사</span>
                    <span className="text-red-500 font-bold text-xs flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-sm">arrow_upward</span> 42%
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">1,248건</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[13px] font-bold"><span className="text-slate-500">진보 매체</span><span className="text-blue-600">45%</span></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
                    <div className="h-full bg-slate-400" style={{ width: '25%' }}></div>
                    <div className="h-full bg-red-500" style={{ width: '30%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-medium text-slate-400">
                    <span>진보</span><span>중립</span><span>보수</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        <section className="mb-20">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between bg-[#F9FAFB] border border-slate-100 rounded-3xl px-8 py-6 mb-8 gap-8">
            <div className="flex flex-col gap-1.5 text-left">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[24px] text-primary">newspaper</span>
                <h3 className="text-[20px] font-bold text-slate-900 tracking-tight whitespace-nowrap">언론사별 주요 논조</h3>
              </div>
              <div className="flex items-center gap-1 mt-2">
                {[
                  { id: 'all', label: '전체' },
                  { id: 'progressive', label: '진보', hover: 'hover:text-progressive' },
                  { id: 'neutral', label: '중립', hover: 'hover:text-slate-600' },
                  { id: 'conservative', label: '보수', hover: 'hover:text-conservative' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStance(tab.id)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      activeStance === tab.id
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : `text-slate-400 ${tab.hover}`
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 max-w-3xl w-full text-left">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-bold text-slate-500 uppercase tracking-wider">언론 지형 분포</span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 text-[11px] font-bold shadow-sm">158개 데이터</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[12.5px] font-bold text-slate-900">데이터 신뢰도 99.1%</span>
                  <span className="material-symbols-outlined text-[14px] text-blue-500" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="reliability-bar mb-2.5 bg-slate-200">
                <div className="reliability-segment bg-[#2563eb]/70" style={{ width: '30%' }}></div>
                <div className="reliability-segment bg-slate-300" style={{ width: '20%' }}></div>
                <div className="reliability-segment bg-[#dc2626]/70" style={{ width: '50%' }}></div>
              </div>
              <div className="flex justify-between items-center text-[11.5px] font-bold px-0.5">
                <div className="flex items-center gap-1.5 text-[#2563eb]">
                  <span className="size-1.5 rounded-full bg-[#2563eb]"></span> 진보 30%
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="size-1.5 rounded-full bg-slate-300"></span> 중립 20%
                </div>
                <div className="flex items-center gap-1.5 text-[#dc2626]">
                  보수 50% <span className="size-1.5 rounded-full bg-[#dc2626]"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group/scroll">
            <div className="horizontal-scroll-container hide-scrollbar !px-0">
              {opinions.filter(o => activeStance === 'all' || o.stance === activeStance).map(o => (
                <OpinionCard 
                  key={o.id}
                  media={o.media}
                  stance={o.stance as any}
                  score={o.score}
                  title={o.title}
                  analysisTitle={o.analysisTitle}
                  description={o.description}
                  sources={o.sources}
                />
              ))}
            </div>
            {/* Scroll Hint Gradient */}
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 opacity-60 group-hover/scroll:opacity-20 transition-opacity"></div>
            <div className="flex justify-center gap-1.5 mt-2">
              <div className="size-1.5 rounded-full bg-primary/40 animate-pulse"></div>
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tighter cursor-default select-none">Scroll for more context</span>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
              <span className="text-slate-500 text-[14px] font-medium">정보의 응집력을 위해 섹션 헤더 및 데이터 분포 레이아웃을 최적화했습니다.</span>
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

      {/* Modal Overlay & Content - High Z-index to cover header */}
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
