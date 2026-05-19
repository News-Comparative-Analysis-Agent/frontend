import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import Breadcrumb from '../components/ui/Breadcrumb'
import Loader from '../components/ui/Loader'
import { postNlpSearch } from '../api/search'
import { NlpSearchData, NlpSearchArticle } from '../types/models/search'
import { motion, AnimatePresence } from 'framer-motion'
import { PUBLISHER_LOGOS } from '../utils/publisherLogos'

const SearchResultsPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  
  const [inputValue, setInputValue] = useState(query)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchData, setSearchData] = useState<NlpSearchData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sliderIndex, setSliderIndex] = useState(0)
  const itemsPerPage = 10

  // 기사 매칭 고도화 헬퍼 함수
  const getArticleById = (refId: string) => {
    if (!searchData || !searchData.articles) return null;
    
    // 1. ID 완전 일치 확인
    let found = searchData.articles.find(a => a.id === refId);
    if (found) return found;
    
    // 2. 숫자 기반 매칭 (article_ 접두어 무시)
    const numericId = refId.replace(/[^0-9]/g, '');
    if (numericId) {
      found = searchData.articles.find(a => a.id.replace(/[^0-9]/g, '') === numericId);
      if (found) return found;
      
      // 3. 인덱스 기반 매칭 (article_1 이면 0번 인덱스)
      const idx = parseInt(numericId) - 1;
      if (!isNaN(idx) && idx >= 0 && searchData.articles[idx]) {
        return searchData.articles[idx];
      }
    }
    
    return null;
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!query) return

      setLoading(true)
      setError(null)
      try {
        const response = await postNlpSearch(query)
        if (response.success) {
          setSearchData(response.data)
        } else {
          setError(response.message || '검색 결과를 가져오는 데 실패했습니다.')
        }
      } catch (err) {
        console.error('NLP Search Error:', err)
        setError('서버와 통신 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    setInputValue(query)
  }, [query])

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }


  // 페이지네이션 로직
  const totalArticles = searchData?.articles || []
  const totalPages = Math.ceil(totalArticles.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentArticles = totalArticles.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return (
      <Layout variant="white" activeStep={1} hideFooter={true}>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[600px]">
          <Loader 
            text={`'${query}'과(와) 관련된 기사 수집 중...`} 
            subText="최적의 검색 결과를 생성하고 있으니 잠시만 기다려주세요"
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout variant="white" activeStep={1}>
      <Breadcrumb items={[`'${query}' 검색 결과`]} />

      <section className="flex-1 overflow-y-auto custom-scrollbar animate-page-in min-h-0">
        {/* Search Input Area */}
        <div className="bg-white border-b border-slate-100 pt-6 md:pt-8 pb-4 md:pb-6 sticky top-0 z-30">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex flex-col w-full max-w-4xl mx-auto md:px-0">
              <div className="max-w-4xl w-full relative mx-auto group">
                <input 
                  className="w-full h-12 md:h-14 pl-8 pr-16 bg-slate-50 border-slate-200 rounded-full text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium shadow-sm" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  type="text" 
                />
                <Button 
                  variant="primary" 
                  size="icon" 
                  icon="search" 
                  className="absolute right-1.5 md:right-2 top-1 md:top-2 h-10 w-10 md:h-10 md:w-10 rounded-full shadow-md"
                  onClick={() => handleSearch()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-4 md:pt-6 pb-40">
          {error ? (
            <div className="max-w-4xl mx-auto py-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">error_outline</span>
              <h2 className="text-xl font-bold text-slate-800 mb-2">검색 결과를 불러올 수 없습니다</h2>
              <p className="text-slate-500">{error}</p>
              <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>다시 시도</Button>
            </div>
          ) : searchData ? (
            <>
              {/* 인트로 영역 및 가이드 */}
              <div className="max-w-6xl mx-auto mb-6 text-left">
                <div className="p-5 rounded-2xl bg-orange-50/50 border border-primary/20 text-left shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 pl-1">
                    <div className="flex items-start gap-4 flex-1">
                      <span className="material-symbols-outlined text-primary text-2xl mt-0.5">info</span>
                      <p className="text-slate-700 text-[15px] leading-relaxed text-left">
                        검색하신 <strong className="text-primary font-bold underline underline-offset-4 decoration-primary/30 text-[17px]">'{query}'</strong>과 관련하여, 여러 언론사가 공통으로 주목하는 <strong className="text-primary font-bold underline underline-offset-4 decoration-primary/30 text-[17px]">사설/칼럼</strong> 뉴스들을 모았습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI 뉴스 요약 (메인 페이지 통합인기 스타일의 그리드 레이아웃) */}
              <div className="max-w-6xl mx-auto mb-12 text-left">
                {searchData.ai_summary_structured ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
                    {searchData.ai_summary_structured.topics.map((topic, idx) => {
                      const primaryArticleId = topic.related_articles[0];
                      
                      return (
                        <div 
                          key={topic.id} 
                          className="group cursor-pointer flex flex-col gap-3 transition-all duration-300"
                          onClick={() => primaryArticleId && navigate(`/analysis?id=${primaryArticleId}`)}
                        >
                          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 bg-slate-50 group-hover:shadow-md group-hover:border-primary/20 transition-all">
                            <img 
                              alt={topic.title} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                              src={`https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop&sig=${idx}`}
                            />
                            
                            {/* 화살표 아이콘 */}
                            <div className="absolute top-3 right-3 z-20">
                              <div className="size-8 rounded-full flex items-center justify-center transition-all border shadow-md bg-white/80 backdrop-blur-sm text-slate-300 border-slate-100 group-hover:text-primary group-hover:bg-white group-hover:border-primary/20">
                                <span className="material-symbols-outlined text-[20px] font-bold">
                                  arrow_forward
                                </span>
                              </div>
                            </div>

                            {/* 바텀 그라데이션 오버레이 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>

                          <div className="flex flex-col gap-1.5 px-1">
                            <h6 className="text-[15px] font-bold leading-tight transition-colors line-clamp-2 min-h-[2.5rem] text-slate-800 group-hover:text-primary">
                              {topic.title}
                            </h6>
                            

                            <div className="flex flex-col gap-1.5 mt-1 pt-2 border-t border-slate-100">
                              {topic.related_articles.slice(0, 2).map((articleId, artIdx) => {
                                const article = getArticleById(articleId);
                                if (!article) return null;
                                return (
                                  <div key={articleId} className="flex items-center gap-2 group/art overflow-hidden">
                                    <span className="shrink-0 text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 group-hover/art:border-primary/20 group-hover/art:text-primary transition-colors">
                                      {article.source}
                                    </span>
                                    <p className="text-[11px] text-slate-600 font-medium truncate group-hover/art:text-primary transition-colors">
                                      {article.title}
                                    </p>
                                  </div>
                                );
                              })}
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">관련 기사 {topic.related_articles.length}건</span>
                                <span className="material-symbols-outlined text-[16px] text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-0.5">arrow_forward</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 shadow-premium border border-slate-100 prose prose-slate max-w-none text-left">
                    {searchData.ai_summary.split(/\n+/).filter(p => p.trim() !== '').map((paragraph, pIdx) => (
                      <p key={pIdx} className="text-slate-700 text-[16px] leading-[1.8] mb-6 text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* 하단 섹션 안내 박스 */}
              <div className="max-w-6xl mx-auto border-t-4 border-double border-slate-100 pt-8 mb-6 text-left">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 text-left">찾으시는 뉴스가 없으신가요?</h3>
                    <p className="text-slate-500 text-sm text-left">
                      아래의 각 언론사 개별 뉴스 목록은 <strong className="text-primary font-bold">기사 원문 읽기</strong>만 가능하며, AI 심층 분석 기능은 제공되지 않습니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                    <span className="material-symbols-outlined">info</span>
                    원문 링크만 제공
                  </div>
                </div>
              </div>

              {/* ARTICLE LIST - Publisher Cards Slider (Framer Motion Edition) */}
              <div className="max-w-[1440px] mx-auto mb-32 relative group/slider">
                {(() => {
                  const groupedMap = currentArticles.reduce((acc, news) => {
                    if (!acc[news.source]) acc[news.source] = [];
                    acc[news.source].push(news);
                    return acc;
                  }, {} as Record<string, NlpSearchArticle[]>);

                  const publishers = Object.keys(groupedMap);
                  const maxIndex = Math.max(0, publishers.length - 5);

                  const nextSlide = () => {
                    setSliderIndex(prev => Math.min(prev + 1, maxIndex));
                  };

                  const prevSlide = () => {
                    setSliderIndex(prev => Math.max(prev - 1, 0));
                  };


                  return (
                    <div className="relative">
                      {/* Navigation Buttons (Outside Margin Style) */}
                      <button 
                        onClick={prevSlide}
                        disabled={sliderIndex === 0}
                        className="absolute -left-14 top-1/2 -translate-y-1/2 z-50 size-11 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-0 group-hover/slider:opacity-100 opacity-0"
                      >
                        <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                      </button>
                      <button 
                        onClick={nextSlide}
                        disabled={sliderIndex >= maxIndex}
                        className="absolute -right-14 top-1/2 -translate-y-1/2 z-50 size-11 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-0 group-hover/slider:opacity-100 opacity-0"
                      >
                        <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                      </button>

                      {/* Slider Track Container (Clips the sliding cards) */}
                      <div className="overflow-hidden">
                        <motion.div 
                          className="flex gap-4"
                          animate={{ x: `calc(-${sliderIndex} * ( (100% - 48px) / 5 + 12px ))` }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {publishers.map((source) => {
                            const articles = groupedMap[source];
                            return (
                              <div 
                                key={source} 
                                className="flex-shrink-0 w-[calc((100%-48px)/5)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                              >
                                {/* Card Header (Main Page Exact Style) */}
                                <div className="flex items-center justify-between p-3.5 bg-white border-b border-slate-50">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="size-5 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
                                      {PUBLISHER_LOGOS[source] ? (
                                        <img src={PUBLISHER_LOGOS[source]} alt="" className="w-full h-full object-contain" />
                                      ) : (
                                        <span className="text-[10px] font-bold text-slate-400">{source[0]}</span>
                                      )}
                                    </div>
                                    <h4 className="text-[14px] font-semibold text-slate-800 truncate leading-none">
                                      {source}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                                    {articles.length}건
                                  </span>
                                </div>

                                {/* News List (Main Page Exact Style) */}
                                <div className="flex flex-col divide-y divide-slate-50 flex-1">
                                  {articles.map((article) => (
                                      <div 
                                        key={article.id}
                                        className="group/item flex gap-3 p-3 transition-colors items-center relative cursor-pointer hover:bg-slate-50"
                                        onClick={() => window.open(article.link, '_blank')}
                                        title="기사 원문 보기"
                                      >
                                        <div className="flex-1 min-w-0 flex flex-col gap-1 text-left">
                                            <h5 className="text-[12px] font-normal leading-[1.3] tracking-tight transition-colors line-clamp-3 text-slate-800 group-hover/item:text-primary mb-1">
                                              {article.title}
                                            </h5>
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 text-slate-400">
                                              <span className="material-symbols-outlined text-[12px]">schedule</span>
                                              <span className="text-[10px] font-medium">
                                                {new Date(article.pubDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                            </div>
                                            <span className="material-symbols-outlined text-[16px] text-slate-300 group-hover/item:text-primary transition-all">open_in_new</span>
                                          </div>
                                        </div>

                                        <div className="size-14 shrink-0 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 relative group-hover/item:border-primary/20 transition-colors">
                                          <img
                                            alt=""
                                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                            src={`https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200&auto=format&fit=crop&sig=${article.id}`}
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=200&auto=format&fit=crop'; }}
                                          />
                                        </div>
                                      </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-100 mb-4">search_off</span>
              <p className="text-slate-400 font-medium">검색 결과를 입력해 주세요.</p>
            </div>
          )}
        </div>
      </section>

    </Layout>
  )
}

export default SearchResultsPage
