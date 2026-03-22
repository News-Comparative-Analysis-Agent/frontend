import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { fetchTopNewsByPublisher } from '../api/news'
import { fetchDailyIssues } from '../api/issues'
import { NewsArticle } from '../types'
import { DailyIssuesResponse } from '../types/issues'

// 언론사별 색상 설정 (호버 시 주황색 포인트 복구)
const PUBLISHER_STYLES: Record<string, { borderColor: string; color: string; textColor: string }> = {
  '조선일보': { borderColor: 'border-slate-500',   color: 'bg-slate-600',   textColor: 'text-primary' },
  '한겨레':   { borderColor: 'border-slate-500',    color: 'bg-slate-600',    textColor: 'text-primary' },
  '경향신문': { borderColor: 'border-slate-500',  color: 'bg-slate-600',  textColor: 'text-primary' },
  '동아일보': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-primary' },
  '연합뉴스': { borderColor: 'border-slate-500', color: 'bg-slate-600', textColor: 'text-primary' },
}
const DEFAULT_STYLE = { borderColor: 'border-slate-400', color: 'bg-slate-400', textColor: 'text-primary' }
const PUBLISHER_ORDER = ['조선일보', '한겨레', '경향신문', '동아일보', '연합뉴스']

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const MainPage = () => {
  const navigate = useNavigate()
  const [selectedMedia, setSelectedMedia] = useState<string[]>(PUBLISHER_ORDER)
  const [activePopularTab, setActivePopularTab] = useState<'integrated' | 'chartout'>('integrated')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [newsData, setNewsData] = useState<Record<string, NewsArticle[]>>({})
  const [dailyIssues, setDailyIssues] = useState<DailyIssuesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topImageIndex, setTopImageIndex] = useState(0)

  useEffect(() => {
    setCurrentPage(1)
  }, [activePopularTab])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 두 개의 API 요청을 병렬로 처리
        const [newsResponse, issuesResponse] = await Promise.all([
          fetchTopNewsByPublisher(),
          fetchDailyIssues()
        ])
        
        setNewsData(newsResponse)
        setDailyIssues(issuesResponse)
      } catch (e) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // 통합 인기 1위 이미지 자동 로테이션 타이머
  useEffect(() => {
    if (!dailyIssues || dailyIssues.top_issues.length === 0 || activePopularTab !== 'integrated') {
      setTopImageIndex(0);
      return;
    }

    const currentIssue = dailyIssues.top_issues[0];
    const images = currentIssue.image_urls || [];
    
    if (images.length <= 1) {
      setTopImageIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setTopImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4초마다 전환

    return () => clearInterval(timer);
  }, [dailyIssues, activePopularTab]);

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
        <section className="bg-primary h-[180px] flex flex-col justify-center relative z-10 hero-depth-shadow">
          <div className="max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between gap-24">
            <div className="flex-1 text-left shrink-0">
              <h2 className="text-4xl font-extrabold text-white tracking-tight leading-[1.3] break-keep">
                기사 작성의 모든 과정,<br />실시간으로 도와드립니다.
              </h2>
            </div>
            <div className="flex flex-row items-start gap-8 py-6 flex-[2]">
              <div className="flex flex-col items-start gap-2 flex-1 relative">
                <span className="flex items-center justify-center size-14 rounded-full bg-white text-primary text-2xl font-black shadow-glow ring-4 ring-white/30 shrink-0">1</span>
                <div className="text-left">
                  <p className="text-[18px] font-black text-white leading-none">주제 선택</p>
                   <p className="text-[13px] text-white mt-1.5 leading-snug font-medium opacity-90">주제를 선택하거나 검색해 보세요.</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70">
                <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">2</span>
                <div className="text-left">
                  <p className="text-[16px] font-bold text-white leading-none">심층 분석</p>
                  <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">진보/보수 관점을 비교 분석합니다.</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70">
                <span className="flex items-center justify-center size-10 rounded-full bg-white/20 text-white text-lg font-bold border border-white/30 shrink-0">3</span>
                <div className="text-left">
                  <p className="text-[16px] font-bold text-white leading-none">초안 작성</p>
                  <p className="text-[12px] text-white/80 mt-2 leading-snug font-normal">AI가 기사 초안을 작성합니다.</p>
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 flex-1 mt-2 opacity-70 -ml-6">
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
              icon="pulse_dot"
              title="오늘의 뉴스 트렌드"
              description="2026.02.23 14:00 기준"
            />
            <div className="relative w-[380px] focus-within:w-[480px] transition-all duration-500 ease-out group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                id="search-input"
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all bg-white shadow-sm placeholder:text-slate-400"
                placeholder="포커스에서 분석하고 싶은 뉴스를 검색해보세요"
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
          <div className="flex flex-col xl:flex-row gap-4 items-start">

            <div className="w-full xl:w-[54%] flex flex-col">
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

                {/* 필터 카테고리 바 - 사용자가 준 사진처럼 스타일 리뉴얼 */}
                <div className="mt-auto pb-2">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full w-full no-scrollbar overflow-x-auto border border-slate-200/50 shadow-inner">
                    <button 
                      onClick={() => handleMediaChange('전체')}
                      className={`flex-1 min-w-[70px] py-2 rounded-full text-[14px] font-medium transition-all duration-300 ${
                        selectedMedia.length === 5 
                          ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
                      }`}
                      style={selectedMedia.length === 5 ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
                    >
                      전체
                    </button>
                    {PUBLISHER_ORDER.map(media => (
                      <button 
                        key={media}
                        onClick={() => handleMediaChange(media)}
                        className={`flex-1 min-w-[70px] py-2 rounded-full text-[14px] font-medium transition-all duration-300 ${
                          selectedMedia.includes(media) 
                            ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
                        }`}
                        style={selectedMedia.includes(media) ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  {filteredPublishers.map(publisher => {
                    const articles = newsData[publisher] ?? []
                    const style = PUBLISHER_STYLES[publisher] ?? DEFAULT_STYLE
                    return (
                      <div key={publisher} className="shadow-premium-card p-6 transition-all duration-300 group/card">
                        <div className={`border-t-[3px] ${style.borderColor} mb-5`}></div>
                        <div className="flex items-center justify-between mb-5">
                          <h4 className="text-lg font-bold text-slate-700 flex items-center gap-1 group-hover/card:text-primary transition-colors">
                            {publisher} <span className="material-symbols-outlined text-sm group-hover/card:translate-x-1 transition-transform">chevron_right</span>
                          </h4>
                        </div>
                        <div className="space-y-0 divide-y divide-slate-50">
                          {articles.map((article, idx) => (
                            <a
                              key={article.id}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${idx === 0 ? 'pb-6 pt-1 border-b border-slate-100 block' : 'py-2.5 flex gap-3 items-baseline'} group/item cursor-pointer`}
                            >
                              {idx === 0 ? (
                                <>
                                  <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                      alt={article.title}
                                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                                      src={article.image_url || DEFAULT_IMAGE}
                                      onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                                    />
                                    <div className={`absolute top-2 left-2 size-7 ${style.color} text-white flex items-center justify-center font-bold rank-number rounded shadow-md text-xs`}>1</div>
                                  </div>
                                  <h5 className={`text-[14px] font-bold text-slate-900 leading-snug group-hover/item:${style.textColor} transition-colors line-clamp-2`}>
                                    {article.title}
                                  </h5>
                                </>
                              ) : (
                                <>
                                  <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center shrink-0">{idx + 1}</span>
                                  <p className={`text-[12.5px] font-medium text-slate-700 truncate flex-1 group-hover/item:${style.textColor} transition-colors`}>
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

            <div className="xl:flex-1 min-w-0 border-l border-slate-100 pl-4 flex flex-col text-left">
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
                
                {/* Popular Tabs - 리뉴얼 스타일 적용 */}
                <div className="mt-auto pb-2">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full w-full border border-slate-200/50 shadow-inner">
                    <button 
                      onClick={() => setActivePopularTab('integrated')}
                      className={`flex-1 py-2 rounded-full text-[14px] font-medium transition-all duration-300 ${
                        activePopularTab === 'integrated' 
                          ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
                        }`}
                        style={activePopularTab === 'integrated' ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
                    >
                      실시간 통합 순위
                    </button>
                      <button 
                        onClick={() => setActivePopularTab('chartout')}
                        className={`flex-1 py-2 rounded-full text-[14px] font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                          activePopularTab === 'chartout' 
                            ? 'bg-white text-slate-900 font-bold shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-white/50 font-medium'
                        }`}
                        style={activePopularTab === 'chartout' ? { textShadow: '0 1px 1px rgba(0,0,0,0.1)' } : {}}
                      >
                        차트아웃
                        <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-black animate-pulse ${activePopularTab === 'chartout' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}>OUT</span>
                      </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                {activePopularTab === 'integrated' ? (
                  <div className="divide-y divide-slate-100">
                    {loading || !dailyIssues ? (
                      // 로딩 스켈레톤
                      <div className="animate-pulse space-y-6">
                        <div className="h-[240px] bg-slate-100 rounded-xl w-full" />
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-6 bg-slate-50 rounded w-full" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* 통합 인기 1위 */}
                        {dailyIssues.top_issues.length > 0 && (
                          <div 
                            className="shadow-premium-card p-6 group cursor-pointer w-full mb-6" 
                            onClick={() => navigate(`/analysis?id=${dailyIssues.top_issues[0].id}`)}
                          >
                            <div className="border-t-[3px] border-primary mb-5"></div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-primary flex items-center gap-1 tracking-tight">통합 인기 1위</h4>
                            </div>
                            <div className="pb-4 pt-1 group cursor-pointer border-b border-slate-100">
                              <div className="relative w-full aspect-[21/9] mb-3 overflow-hidden rounded-xl bg-slate-100">
                                {dailyIssues.top_issues[0].image_urls.map((url, imgIdx) => (
                                  <img 
                                    key={`${dailyIssues.top_issues[0].id}-${imgIdx}`}
                                    alt={dailyIssues.top_issues[0].name} 
                                    className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out ${
                                      imgIdx === topImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                    }`} 
                                    src={url || DEFAULT_IMAGE}
                                  />
                                ))}
                                {dailyIssues.top_issues[0].image_urls.length === 0 && (
                                  <img 
                                    alt={dailyIssues.top_issues[0].name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    src={DEFAULT_IMAGE}
                                  />
                                )}
                                <div className="absolute top-2 left-2 size-7 bg-primary text-white flex items-center justify-center font-black rank-number rounded shadow-glow z-10">1</div>
                                <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-lg flex items-center shadow-sm z-10">
                                  <span className="text-[10px] font-bold text-slate-700">AI 초안 작성 완료</span>
                                </div>
                                
                                {/* 이미지 인덱스 인디케이터 */}
                                {dailyIssues.top_issues[0].image_urls.length > 1 && (
                                  <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                                    {dailyIssues.top_issues[0].image_urls.map((_, i) => (
                                      <div 
                                        key={i} 
                                        className={`size-1 rounded-full transition-all duration-300 ${
                                          i === topImageIndex ? 'bg-white w-3' : 'bg-white/40'
                                        }`} 
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                              <h5 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                {dailyIssues.top_issues[0].name}
                              </h5>
                            </div>
                          </div>
                        )}

                        {/* 나머지 순위 리스트 */}
                        <div className="divide-y divide-slate-50 bg-white">
                          {dailyIssues.top_issues.slice(1).map((issue) => (
                            <div 
                              key={issue.id} 
                              className="py-2.5 group cursor-pointer flex gap-4 items-baseline" 
                              onClick={() => navigate(`/analysis?id=${issue.id}`)}
                            >
                              <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center shrink-0">{issue.rank}</span>
                              <p className="text-[14px] font-medium text-slate-700 truncate flex-1 group-hover:text-primary transition-colors">
                                {issue.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                 ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col h-full">
                    {loading || !dailyIssues ? (
                      // 로딩 스켈레톤
                      <div className="animate-pulse space-y-6">
                        <div className="h-[320px] bg-slate-100 rounded-3xl w-full" />
                        <div className="space-y-4">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-12 bg-slate-50 rounded-xl w-full" />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* 차트아웃 데이터 페이징 처리 */}
                        {(() => {
                          const itemsOnPage1 = 5;
                          const itemsOnOtherPages = 10;
                          const allChartoutItems = dailyIssues.chart_out_issues;
                          
                          if (allChartoutItems.length === 0) {
                            return (
                              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <span className="material-symbols-outlined text-4xl">history_toggle_off</span>
                                <p className="text-sm font-medium">최근 차트아웃된 이슈가 없습니다.</p>
                              </div>
                            );
                          }

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
                                    item.is_chart_out && currentPage === 1 && idx === 0 ? (
                                      <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-1 mb-4 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500 shrink-0" onClick={() => navigate(`/analysis?id=${item.id}`)}>
                                        <div className="p-5">
                                           <div className="flex items-center justify-between mb-4">
                                              <h3 className="text-[17px] font-bold text-slate-800">최근 차트아웃 이슈</h3>
                                           </div>
                                           <div className="relative w-full aspect-[21/9] mb-5 overflow-hidden rounded-2xl bg-slate-100">
                                              <img 
                                                alt={item.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                                src={(item.image_urls && item.image_urls.length > 0) ? item.image_urls[0] : DEFAULT_IMAGE}
                                                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
                                              />
                                              <div className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-black rounded-lg flex items-center justify-center tracking-tighter">
                                                 OUT
                                               </div>
                                           </div>
                                           <h4 className="text-[18px] font-black text-slate-900 leading-tight mb-3 group-hover:text-primary transition-colors break-keep line-clamp-2">
                                             {item.name}
                                           </h4>
                                           <div className="flex items-center justify-between">
                                              <p className="text-[12px] text-slate-400 font-medium">최고 {item.peak_rank}위 / {item.chart_out_minutes}분 전 차트아웃</p>
                                           </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div key={idx} className={`${currentPage === 1 ? 'py-3 px-1 rounded-xl hover:bg-slate-50 border-b border-slate-50 last:border-0' : 'py-2.5 px-1 hover:bg-slate-50'} flex items-center justify-between transition-all group cursor-pointer shrink-0`} onClick={() => navigate(`/analysis?id=${item.id}`)}>
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                          <span className="px-2 py-0.5 border border-slate-200 text-slate-400 text-[9px] font-black rounded-lg shrink-0 group-hover:border-primary/30 group-hover:text-primary transition-colors">OUT</span>
                                          <div className="min-w-0">
                                             <p className="text-[14px] font-bold text-slate-800 truncate mb-1 group-hover:text-primary transition-colors">{item.name}</p>
                                             <p className="text-[11px] text-slate-400 font-medium">최고 {item.peak_rank}위 / {item.chart_out_minutes}분 전 차트아웃</p>
                                          </div>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 text-[18px] group-hover:text-primary transition-colors">chevron_right</span>
                                      </div>
                                    )
                                  ))}
                                </div>
                              </div>

                              {/* 페이지네이션 UI - 위치 고정 보강 */}
                              {totalPages > 1 && (
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
                              )}
                            </div>
                          );
                        })()}
                      </>
                    )}
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
