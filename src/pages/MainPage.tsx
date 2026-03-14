import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { fetchTopNewsByPublisher } from '../api/news'
import { NewsArticle } from '../types'

// 언론사별 색상 설정 (진한 회색으로 통일)
const PUBLISHER_STYLES: Record<string, { borderColor: string; color: string; textColor: string }> = {
  '조선일보': { borderColor: 'border-slate-500',   color: 'bg-slate-600',   textColor: 'text-slate-900' },
  '한겨레':   { borderColor: 'border-slate-500',    color: 'bg-slate-600',    textColor: 'text-slate-900' },
  '경향신문': { borderColor: 'border-slate-500',  color: 'bg-slate-600',  textColor: 'text-slate-900' },
  '동아일보': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-slate-900' },
  '연합뉴스': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-slate-900' },
}
const DEFAULT_STYLE = { borderColor: 'border-slate-400', color: 'bg-slate-400', textColor: 'text-slate-600' }
const PUBLISHER_ORDER = ['조선일보', '한겨레', '경향신문', '동아일보', '연합뉴스']

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const MainPage = () => {
  const navigate = useNavigate()
  const [selectedMedia, setSelectedMedia] = useState<string[]>(['조선일보', '한겨레'])
  const [activePopularTab, setActivePopularTab] = useState<'integrated' | 'chartout'>('integrated')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [newsData, setNewsData] = useState<Record<string, NewsArticle[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCurrentPage(1)
  }, [activePopularTab])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const data = await fetchTopNewsByPublisher()
        setNewsData(data)
      } catch (e) {
        setError('뉴스를 불러오는 중 오류가 발생했습니다.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const handleMediaChange = (media: string) => {
    if (media === '전체') {
      setSelectedMedia(selectedMedia.length === 5 ? [] : [...PUBLISHER_ORDER])
      return
    }
    if (selectedMedia.includes(media)) {
      setSelectedMedia(selectedMedia.filter(m => m !== media))
    } else {
      setSelectedMedia([...selectedMedia, media])
    }
  }

  const filteredPublishers = PUBLISHER_ORDER.filter(p => selectedMedia.includes(p))

  return (
    <Layout>
      <div className="animate-page-in">
        {/* Hero */}
        <section className="bg-primary h-[180px] flex flex-col justify-center">
          <div className="max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between gap-24">
            <div className="flex-1 text-left shrink-0">
              <h2 className="text-4xl font-extrabold text-white tracking-tight leading-[1.3] break-keep">
                기사 작성의 모든 과정,<br />실시간으로 도와드립니다.
              </h2>
            </div>
            <div className="flex flex-row items-start gap-8 py-6 flex-[2]">
              <div className="flex flex-col items-start gap-2 flex-1 relative cursor-pointer" onClick={() => navigate('/')}>
                <span className="flex items-center justify-center size-14 rounded-full bg-white text-primary text-2xl font-black shadow-glow ring-4 ring-white/30 shrink-0">1</span>
                <div className="text-left">
                  <p className="text-[18px] font-black text-white leading-none">주제 선택</p>
                   <p className="text-[13px] text-white mt-1.5 leading-snug font-medium opacity-90">주제를 선택하거나 검색해 보세요.</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => navigate('/analysis')}>
                <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">2</span>
                <div className="text-left">
                  <p className="text-[16px] font-bold text-white leading-none">심층 분석</p>
                  <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">진보/보수 관점을 비교 분석합니다.</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => navigate('/drafting')}>
                <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">3</span>
                <div className="text-left">
                  <p className="text-[16px] font-bold text-white leading-none">초안 작성</p>
                  <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">AI가 기사 초안을 작성합니다.</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70 cursor-pointer hover:opacity-100 transition-opacity -ml-6" onClick={() => navigate('/final-review')}>
                <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">4</span>
                <div className="text-left">
                   <p className="text-[16px] font-bold text-white leading-none">최종 검토</p>
                  <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">기사 품질 검토 후 발행합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 검색 헤더 */}
        <div className="max-w-[1400px] mx-auto px-6 pt-8">
          <div className="flex items-center justify-between border-b-2 border-slate-900/5 pb-6">
            <SectionHeader
              icon="trending_up"
              title="오늘의 뉴스 트렌드"
              description="2026.02.23 14:00 기준 / 1시간마다 업데이트"
            />
            <div className="relative w-[380px] focus-within:w-[480px] transition-all duration-500 ease-out group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                id="search-input"
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-white shadow-sm placeholder:text-slate-400"
                placeholder="찾는 뉴스가 있으신가요?"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                  }
                }}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                  }
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* 뉴스 본문 */}
        <div className="max-w-[1400px] mx-auto px-6 pb-12 pt-6">
          <div className="flex flex-col xl:flex-row gap-10 items-start">

            <div className="w-full xl:w-[55%] flex flex-col">
              <div className="h-[135px] flex flex-col">
                <div className="flex items-center justify-between h-8 mb-1">
                  <h2 
                    className="text-slate-800 text-xl font-bold tracking-tight section-highlight"
                  >
                    각 언론사별 현재 인기 뉴스에요
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 mt-3.5 mb-2 text-[12px] text-slate-500 font-medium opacity-90">
                  <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                  필터를 선택하여 원하는 언론사의 인기 뉴스만 골라볼 수 있어요.
                </div>
                <div className="w-full h-px bg-slate-100 mb-2"></div>

                {/* 필터 카테고리 바 - 간격 최적화 및 높이 통일 */}
                <div className="mt-auto pb-2">
                  <div className="flex items-center gap-2 p-1.5 bg-slate-300/80 rounded-xl w-full no-scrollbar overflow-x-auto shadow-sm">
                    <button 
                      onClick={() => handleMediaChange('전체')}
                      className={`flex-1 min-w-[64px] py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${
                        selectedMedia.length === 5 
                          ? 'bg-white text-slate-900 shadow-sm transform scale-[1.02]' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      전체
                    </button>
                    {PUBLISHER_ORDER.map(media => (
                      <button 
                        key={media}
                        onClick={() => handleMediaChange(media)}
                        className={`flex-1 min-w-[64px] py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${
                          selectedMedia.includes(media) 
                            ? 'bg-white text-slate-900 shadow-sm transform scale-[1.02]' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {media.replace('신문', '').replace('일보', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 로딩 / 에러 / 뉴스 카드 */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse space-y-3">
                      <div className="h-3 w-20 bg-slate-200 rounded" />
                      <div className="w-full aspect-video bg-slate-200 rounded-xl" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      {[...Array(5)].map((_, j) => <div key={j} className="h-3 bg-slate-100 rounded" />)}
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col h-[820px]">
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 flex-1">
                    <span className="material-symbols-outlined text-5xl">wifi_off</span>
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                  {filteredPublishers.map(publisher => {
                    const articles = newsData[publisher] ?? []
                    const style = PUBLISHER_STYLES[publisher] ?? DEFAULT_STYLE
                    return (
                      <div key={publisher} className="news-board-card text-left">
                        <div className={`border-t-[3px] ${style.borderColor} mb-3`}></div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-slate-600 flex items-center gap-1">
                            {publisher} <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </h4>
                        </div>
                        <div className="space-y-0 divide-y divide-slate-50">
                          {articles.map((article, idx) => (
                            <a
                              key={article.id}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${idx === 0 ? 'pb-6 pt-1 border-b border-slate-100 block' : 'py-2.5 flex gap-3 items-baseline'} group cursor-pointer`}
                            >
                              {idx === 0 ? (
                                <>
                                  <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                      alt={article.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      src={article.image_url || DEFAULT_IMAGE}
                                    />
                                    <div className={`absolute top-2 left-2 size-7 ${style.color} text-white flex items-center justify-center font-bold rank-number rounded shadow-md`}>1</div>
                                  </div>
                                  <h5 className={`text-[15px] font-bold text-slate-900 leading-snug group-hover:${style.textColor} transition-colors`}>
                                    {article.title}
                                  </h5>
                                  {article.reporter && (
                                    <p className="text-[11px] text-slate-400 mt-1">{article.reporter} 기자</p>
                                  )}
                                </>
                              ) : (
                                <>
                                  <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center shrink-0">{idx + 1}</span>
                                  <p className={`text-[13px] font-medium text-slate-700 truncate flex-1 group-hover:${style.textColor}`}>
                                    {article.title}
                                  </p>
                                </>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="xl:flex-1 min-w-0 border-l border-slate-100 pl-10 flex flex-col text-left">
              <div className="h-[135px] flex flex-col">
                <div className="flex items-center justify-between h-8 mb-1">
                  <h2 
                    key={activePopularTab}
                    className="text-slate-800 text-xl font-bold tracking-tight section-highlight animate-fade-in-up"
                  >
                    {activePopularTab === 'integrated' ? '언론사 공통으로 다루는 인기 뉴스에요' : '최근에 차트에서 아웃된 이슈들이에요'}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 mt-3.5 mb-2 text-[12px] text-slate-500 font-medium opacity-90">
                  <span className="material-symbols-outlined text-[14px] text-primary">info</span>
                  이곳의 기사들은 이미 초안이 준비되어 있어요. 바로 편집을 시작해 보세요!
                </div>
                <div className="w-full h-px bg-slate-100 mb-2"></div>
                
                {/* Popular Tabs - 간격 최적화 및 높이 통일 */}
                <div className="mt-auto pb-2">
                  <div className="flex items-center gap-2 p-1.5 bg-slate-300/80 rounded-xl w-full shadow-sm">
                    <button 
                      onClick={() => setActivePopularTab('integrated')}
                      className={`flex-1 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 ${
                        activePopularTab === 'integrated' 
                          ? 'bg-white text-slate-900 shadow-md transform scale-[1.02]' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      실시간 통합 순위
                    </button>
                    <button 
                      onClick={() => setActivePopularTab('chartout')}
                      className={`flex-1 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        activePopularTab === 'chartout' 
                          ? 'bg-white text-slate-900 shadow-md transform scale-[1.02]' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      차트아웃
                      <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] rounded-full font-black animate-pulse">OUT</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                {activePopularTab === 'integrated' ? (
                  <div className="divide-y divide-slate-100">
                    <div className="news-board-card group cursor-pointer w-full mb-3" onClick={() => navigate('/analysis')}>
                      <div className="border-t-[3px] border-primary"></div>
                      <div className="flex items-center justify-between mt-3 mb-3">
                        <h4 className="text-lg font-bold text-primary flex items-center gap-1 tracking-tight">통합 인기 1위</h4>
                      </div>
                      <div className="pb-4 pt-1 group cursor-pointer border-b border-slate-100">
                        <div className="relative w-full aspect-[21/9] mb-3 overflow-hidden rounded-xl bg-slate-100">
                          <img alt="EU AI Law" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"/>
                          <div className="absolute top-2 left-2 size-7 bg-primary text-white flex items-center justify-center font-black rank-number rounded shadow-glow">1</div>
                          <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-lg flex items-center shadow-sm">
                            <span className="text-[10px] font-bold text-slate-700">AI 초안 작성 완료</span>
                          </div>
                        </div>
                        <h5 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          EU AI 법 최종 가이드라인 발표에 따른 국내 기술 기업의 글로벌 시장 대응 전략 및 규제 리스크 분석
                        </h5>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-50 bg-white">
                      {[
                        { rank: 2, title: '차세대 반도체 HBM4 수주전 격화와 글로벌 공급망 입지 변화' },
                        { rank: 3, title: '수도권 부동산 시장 회복세 및 기준 금리 동결의 시장 영향' },
                        { rank: 4, title: '의대 증원 행정 고시 강행에 따른 의료계 반발 심화' },
                        { rank: 5, title: '국민연금 모수개혁안 여야 협상 타결 가능성 및 쟁점' },
                        { rank: 6, title: '국내 자동차 업계 미래차 전환 및 투자 확대 전략' },
                        { rank: 7, title: '이차전지 소재 국산화 및 공급 안정성 확보 방안' },
                        { rank: 8, title: '금융권 디지털 전환 가속화 및 보안 시스템 강화' },
                        { rank: 9, title: '관광 산업 활성화를 위한 해외 관광객 유치 전략' },
                        { rank: 10, title: '스타트업 생태계 활성화 및 규제 샌드박스 성과' },
                      ].map(article => (
                        <div key={article.rank} className="py-2.5 group cursor-pointer flex gap-4 items-baseline" onClick={() => navigate('/analysis')}>
                          <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center text-slate-400 shrink-0">{article.rank}</span>
                          <p className="text-[14px] font-medium text-slate-700 truncate flex-1 group-hover:text-primary transition-colors">{article.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                 ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col h-full">
                    {/* 차트아웃 데이터 페이징 처리 */}
                    {(() => {
                      const itemsOnPage1 = 5;
                      const itemsOnOtherPages = 10;
                      const allChartoutItems = [
                        { title: '전세사기 특별법 개정안 국회 본회의 통과에 따른 시장 영향 분석', meta: '최고 1위 / 30분 전 차트아웃', isTop: true },
                        { title: '첨단 전략 산업 육성을 위한 규제 샌드박스 확대 방안', meta: '최고 3위 / 1시간 전 차트아웃' },
                        { title: '한일 셔틀 외교 복원과 경제 협력 협의체 구성 효과', meta: '최고 2위 / 2시간 전 차트아웃' },
                        { title: '노동시장 유연화 및 근로시간 개편안 대국민 설론...', meta: '최고 5위 / 4시간 전 차트아웃' },
                        { title: '기후 위기 대응을 위한 신재생 에너지 투자 확대 계획', meta: '최고 4위 / 6시간 전 차트아웃' },
                        { title: '글로벌 공급망 재편에 따른 국내 제조업 경쟁력 강화 전략', meta: '최고 6위 / 8시간 전 차트아웃' },
                        { title: '디지털 자산 가이드라인 수립 및 투자자 보호 대책', meta: '최고 8위 / 9시간 전 차트아웃' },
                        { title: 'K-컬처 글로벌 확산을 위한 콘텐츠 산업 지원 방안', meta: '최고 7위 / 11시간 전 차트아웃' },
                        { title: '바이오 헬스 산업 육성을 위한 R&D 투자 확대', meta: '최고 10위 / 12시간 전 차트아웃' },
                        { title: '지역 소멸 위기 극복을 위한 특화 산업 육성 전략', meta: '최고 9위 / 15시간 전 차트아웃' },
                        { title: '전통시장 활성화를 위한 디지털 전환 지원 고도화', meta: '최고 12위 / 16시간 전 차트아웃' },
                        { title: '청년 창업 지원을 위한 테크 밸리 조성 및 세제 혜택', meta: '최고 11위 / 17시간 전 차트아웃' },
                        { title: '도심 녹지 확충을 위한 파크 시티 프로젝트 시범 운영', meta: '최고 14위 / 18시간 전 차트아웃' },
                        { title: '미래 모빌리티 실증 단지 구축 및 자율주행 보안 가이드', meta: '최고 13위 / 20시간 전 차트아웃' },
                        { title: '공공 의료 서비스 질 향상을 위한 디지털 헬스 보급', meta: '최고 15위 / 22시간 전 차트아웃' },
                        { title: '해외 우수 인재 유치를 위한 비자 제도 개선안 발표', meta: '최고 17위 / 1일 전 차트아웃' },
                        { title: '중소기업 ESG 경영 지원을 위한 맞춤형 컨설팅 확대', meta: '최고 16위 / 1일 전 차트아웃' },
                        { title: '우주 항공 산업 도약을 위한 발사체 기술 자립화 로드맵', meta: '최고 18위 / 1일 전 차트아웃' },
                        { title: '해양 오염 저감을 위한 친환경 선박 전환 지원금 증액', meta: '최고 20위 / 2일 전 차트아웃' },
                        { title: '지능형 교통 시스템(ITS) 전국 확대 및 안전망 강화', meta: '최고 19위 / 2일 전 차트아웃' }
                      ];
                      
                      const totalPages = 1 + Math.ceil(Math.max(0, allChartoutItems.length - itemsOnPage1) / itemsOnOtherPages);
                      let currentItems;
                      if (currentPage === 1) {
                        currentItems = allChartoutItems.slice(0, itemsOnPage1);
                      } else {
                        const startIndex = itemsOnPage1 + (currentPage - 2) * itemsOnOtherPages;
                        currentItems = allChartoutItems.slice(startIndex, startIndex + itemsOnOtherPages);
                      }

                      return (
                        <div className="flex flex-col h-[780px] overflow-hidden">
                          <div className="flex-1 flex flex-col min-h-0">
                            {currentPage > 1 && (
                              <div className="px-1 py-1.5 border-t-[3px] border-slate-200 mb-2 shrink-0 animate-fade-in text-left">
                                <h3 className="text-[17px] font-bold text-slate-600 flex items-center gap-1">
                                  차트아웃 목록 <span className="material-symbols-outlined text-sm">chevron_right</span>
                                </h3>
                              </div>
                            )}
                            <div className={`flex-1 ${currentPage === 1 ? 'space-y-3' : 'space-y-0 divide-y divide-slate-50'} overflow-hidden`}>
                              {currentItems.map((item, idx) => (
                                item.isTop && currentPage === 1 ? (
                                  <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-1 mb-4 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 shrink-0" onClick={() => navigate('/analysis')}>
                                    <div className="p-5">
                                       <div className="flex items-center justify-between mb-4">
                                          <h3 className="text-[17px] font-bold text-slate-800">최근 차트아웃 이슈</h3>
                                       </div>
                                       <div className="relative w-full aspect-[21/9] mb-5 overflow-hidden rounded-2xl bg-slate-100">
                                          <img alt="Chartout" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"/>
                                          <div className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-black rounded-lg flex items-center justify-center tracking-tighter">OUT</div>
                                       </div>
                                       <h4 className="text-[18px] font-black text-slate-900 leading-tight mb-3 group-hover:text-primary transition-colors break-keep">
                                         {item.title}
                                       </h4>
                                       <div className="flex items-center justify-between">
                                          <p className="text-[12px] text-slate-400 font-medium">{item.meta}</p>
                                       </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div key={idx} className={`${currentPage === 1 ? 'py-3 px-1 rounded-xl hover:bg-slate-50 border-b border-slate-50 last:border-0' : 'py-2.5 px-1 hover:bg-slate-50'} flex items-center justify-between transition-all group cursor-pointer shrink-0`} onClick={() => navigate('/analysis')}>
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                      <span className="px-2 py-0.5 border border-slate-200 text-slate-400 text-[9px] font-black rounded-lg shrink-0 group-hover:border-primary/30 group-hover:text-primary transition-colors">OUT</span>
                                      <div className="min-w-0">
                                         <p className="text-[14px] font-bold text-slate-800 truncate mb-1 group-hover:text-primary transition-colors">{item.title}</p>
                                         <p className="text-[11px] text-slate-400 font-medium">{item.meta}</p>
                                      </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 text-[18px] group-hover:text-primary transition-colors">chevron_right</span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>

                          {/* 페이지네이션 UI - 위치 고정 보강 */}
                          <div className="flex items-center justify-center gap-2 mt-auto pt-6 shrink-0 pb-1">
                            <button 
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className={`size-8 flex items-center justify-center rounded-lg transition-all ${currentPage === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`size-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-all ${
                                  currentPage === i + 1 
                                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-110' 
                                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                            <button 
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                              className={`size-8 flex items-center justify-center rounded-lg transition-all ${currentPage === totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-12">
                <Button variant="outline" size="sm" icon="tune">
                  필터 및 매체 설정
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MainPage
