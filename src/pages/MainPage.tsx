import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { fetchTopNewsByPublisher } from '../api/news'
import { NewsArticle } from '../types'

// 언론사별 색상 설정
const PUBLISHER_STYLES: Record<string, { borderColor: string; color: string; textColor: string }> = {
  '조선일보': { borderColor: 'border-blue-500',   color: 'bg-blue-500',   textColor: 'text-blue-600' },
  '한겨레':   { borderColor: 'border-red-500',    color: 'bg-red-500',    textColor: 'text-red-600' },
  '경향신문': { borderColor: 'border-green-500',  color: 'bg-green-500',  textColor: 'text-green-600' },
  '동아일보': { borderColor: 'border-purple-500', color: 'bg-purple-500', textColor: 'text-purple-600' },
  '연합뉴스': { borderColor: 'border-orange-500', color: 'bg-orange-500', textColor: 'text-orange-600' },
}
const DEFAULT_STYLE = { borderColor: 'border-slate-400', color: 'bg-slate-400', textColor: 'text-slate-600' }
const PUBLISHER_ORDER = ['조선일보', '한겨레', '경향신문', '동아일보', '연합뉴스']

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const MainPage = () => {
  const navigate = useNavigate()
  const [selectedMedia, setSelectedMedia] = useState<string[]>(['조선일보', '한겨레'])
  const [newsData, setNewsData] = useState<Record<string, NewsArticle[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
              description="2026년 2월 23일 기준 실시간 분석 결과입니다"
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
                onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-primary transition-colors"
                onClick={() => navigate('/search')}
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

            {/* 왼쪽: 언론사별 인기 뉴스 */}
            <div className="w-full xl:w-[55%] flex flex-col">
              <div className="mb-6 text-left">
                <div className="flex items-center justify-between h-10 mb-2">
                  <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight">각 언론사별 현재 인기 뉴스에요</h2>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
              </div>

              {/* 필터 체크박스 */}
              <div className="mb-6 w-full">
                <div className="flex flex-nowrap gap-2 pb-2 no-scrollbar" id="filter-chips-container">
                  <label className="cursor-pointer select-none shrink-0">
                    <input type="checkbox" className="filter-checkbox peer hidden" checked={selectedMedia.length === 5} onChange={() => handleMediaChange('전체')} />
                    <div className="relative flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-400 text-[12px] font-bold transition-all hover:border-slate-300 peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary">
                      <span className="material-symbols-outlined absolute left-2 text-[16px] leading-none opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all">check_circle</span>
                      <span>전체</span>
                    </div>
                  </label>
                  {PUBLISHER_ORDER.map(media => (
                    <label key={media} className="cursor-pointer select-none shrink-0">
                      <input type="checkbox" className="filter-checkbox peer hidden" checked={selectedMedia.includes(media)} onChange={() => handleMediaChange(media)} />
                      <div className="relative flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-400 text-[12px] font-bold transition-all hover:border-slate-300 peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary">
                        <span className="material-symbols-outlined absolute left-2 text-[16px] leading-none opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all">check_circle</span>
                        <span>{media.replace('신문', '').replace('일보', '')}</span>
                      </div>
                    </label>
                  ))}
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
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                  <span className="material-symbols-outlined text-5xl">wifi_off</span>
                  <p className="text-sm font-medium">{error}</p>
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

            {/* 오른쪽: 통합 인기 뉴스 */}
            <div className="xl:flex-1 min-w-0 border-l border-slate-100 pl-10 flex flex-col text-left">
              <div className="mb-6">
                <div className="flex items-center justify-between h-10 mb-2">
                  <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight">언론사 공통으로 다루는 인기 뉴스에요</h2>
                </div>
                <div className="w-full h-px bg-slate-100"></div>
              </div>

              <div className="flex flex-col flex-1 divide-y divide-slate-100">
                <div className="news-board-card group cursor-pointer w-full mb-3" onClick={() => navigate('/analysis')}>
                  <div className="border-t-[3px] border-primary mb-3"></div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-primary flex items-center gap-1">통합 인기 1위</h4>
                  </div>
                  <div className="pb-4 pt-1 group cursor-pointer border-b border-slate-100">
                    <div className="relative w-full aspect-video mb-3 overflow-hidden rounded-xl">
                      <img alt="EU AI Law" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop"/>
                      <div className="absolute top-2 left-2 size-7 bg-primary text-white flex items-center justify-center font-bold rank-number rounded shadow-md">1</div>
                    </div>
                    <h5 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
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
                      <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center">{article.rank}</span>
                      <p className="text-[14px] font-medium text-slate-700 truncate flex-1 group-hover:text-primary">{article.title}</p>
                    </div>
                  ))}
                </div>
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
