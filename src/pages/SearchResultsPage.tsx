import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import Breadcrumb from '../components/ui/Breadcrumb'
import Loader from '../components/ui/Loader'
import { postNlpSearch } from '../api/search'
import { NlpSearchData, NlpSearchArticle } from '../types/models/search'

const SearchResultsPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [hoveredCitation, setHoveredCitation] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState(query)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchData, setSearchData] = useState<NlpSearchData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
      <Layout variant="white" activeStep={1}>
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
        {/* SEARCH INPUT AREA */}
        <div className="bg-white border-b border-slate-100 pt-6 md:pt-8 pb-4 md:pb-6">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col w-full max-w-4xl mx-auto md:px-0">
              <div className="max-w-4xl w-full relative mx-auto">
                <input 
                  className="w-full h-12 md:h-14 pl-8 pr-16 bg-slate-50 border-slate-200 rounded-full text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium shadow-sm" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  type="text" 
                />
                <Button 
                  variant="icon" 
                  size="icon" 
                  icon="search" 
                  className="absolute right-1.5 md:right-2 top-1 md:top-2 h-10 w-10"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-6 md:pt-10">
          {error ? (
            <div className="max-w-4xl mx-auto py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">error_outline</span>
              <p className="text-slate-500 font-medium">{error}</p>
              <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>다시 시도</Button>
            </div>
          ) : searchData ? (
            <>
              <div className="max-w-7xl mx-auto mb-6 text-left">
                <div className="flex items-start gap-3 p-5 rounded-2xl bg-orange-50/50 border border-primary/10 text-left">
                  <span className="material-symbols-outlined text-primary text-2xl mt-0.5">info</span>
                  <p className="text-slate-700 text-base leading-relaxed text-left">
                    검색하신 <strong className="text-primary font-black underline underline-offset-4 decoration-primary/30 text-lg">'{query}'</strong>과 관련하여, 가장 많이 거론되는 <strong className="text-primary font-black">뉴스</strong>입니다.
                  </p>
                </div>
              </div>

              {/* AI 뉴스 요약 (줄글 형식) */}
              <div className="max-w-7xl mx-auto mb-16 px-4">
                <div className="bg-white rounded-3xl p-10 shadow-premium border border-slate-100 relative overflow-visible">
                  <div className="prose prose-slate max-w-none">
                    {searchData.ai_summary.split(/\n+/).filter(p => p.trim() !== '').slice(1).map((paragraph, pIdx) => {
                      // 지능형 기사 매칭 로직: 문단과 기사 간의 키워드 겹침 점수 계산
                      const words = paragraph.split(/\s+/).filter(w => w.length > 1);
                      let bestIdx = pIdx % searchData.articles.length; // 기본 매칭
                      let maxScore = -1;

                      searchData.articles.slice(0, 15).forEach((article, aIdx) => {
                        let score = 0;
                        const content = (article.title + ' ' + article.description).toLowerCase();
                        words.forEach(word => {
                          if (content.includes(word.toLowerCase())) score++;
                        });
                        if (score > maxScore) {
                          maxScore = score;
                          bestIdx = aIdx;
                        }
                      });

                      const article = searchData.articles[bestIdx];

                      return (
                        <p key={pIdx} className="text-slate-700 text-[16px] leading-[1.8] mb-8 last:mb-0 relative group/para text-justify">
                          {paragraph}
                          {article && (
                            <span 
                              className="relative inline-flex items-center justify-center w-5 h-5 ml-1 text-[11px] font-bold text-white bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-600 transition-all align-middle mb-1 group/cite shadow-sm"
                              onMouseEnter={() => setHoveredCitation(pIdx)}
                              onMouseLeave={() => setHoveredCitation(null)}
                              onClick={() => navigate(`/analysis?id=${article.id}`)}
                            >
                              {['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][pIdx % 10]}
                              
                              {/* 인용 미리보기 팝업 */}
                              {hoveredCitation === pIdx && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[300px] bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in duration-200">
                                  <div className="flex gap-3 items-start">
                                    <div className="flex-1">
                                      <div className="text-[10px] text-primary font-bold mb-1">{article.source}</div>
                                      <div className="text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                                        {article.title}
                                      </div>
                                      <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                        {article.description}
                                      </div>
                                    </div>
                                    <div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100 overflow-hidden">
                                      <span className="material-symbols-outlined text-slate-200 text-3xl">newspaper</span>
                                    </div>
                                  </div>
                                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45"></div>
                                </div>
                              )}
                            </span>
                          )}
                        </p>
                      );
                    })}
                  </div>

                  {/* 핵심 키워드 및 언론사 통계 섹션 */}
                  <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <div className="text-[12px] font-bold text-slate-400 mb-3 ml-1 uppercase tracking-wider">주요 핵심 키워드</div>
                      <div className="flex flex-wrap gap-2">
                        {searchData.generated_keywords.map((kw, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-orange-50 text-primary text-[12px] font-bold rounded-full border border-orange-100 hover:bg-orange-100 transition-colors cursor-default">
                            # {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="min-w-[200px]">
                      <div className="text-[12px] font-bold text-slate-400 mb-3 ml-1 uppercase tracking-wider">언론사별 보도 비중</div>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(searchData.by_source).slice(0, 4).map(([source, count], idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                            <span className="text-slate-600 text-[13px] font-medium">{source}</span>
                            <span className="text-slate-400 text-[11px]">{count}건</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto border-t-4 border-double border-slate-100 pt-16 mb-8 text-left">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 text-left">찾는 뉴스가 없으신가요?</h3>
                    <p className="text-slate-500 text-sm text-left">아래의 전체 뉴스 목록에서 관심 있는 기사를 직접 선택하여 심층 분석을 계속할 수 있습니다.</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined">arrow_downward</span>
                    목록 확인하기
                  </div>
                </div>
              </div>

              <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between px-2">
                <SectionHeader 
                  icon="list_alt" 
                  title="전체 뉴스 목록"
                  titleSize="sm"
                />
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[13px] font-medium tracking-tight">총 {searchData.total_results}건의 뉴스</span>
                </div>
              </div>

              {/* ARTICLE LIST */}
              <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0">
                  {currentArticles.map((news: NlpSearchArticle) => (
                    <div 
                      key={news.id} 
                      className="py-5 hover:bg-slate-50 transition-all group px-8 border-b border-slate-100 md:odd:border-r flex items-center justify-between"
                    >
                      <div 
                        className="flex-1 min-w-0 cursor-pointer" 
                        onClick={() => window.open(news.link, '_blank')}
                        title="원문 보기"
                      >
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-slate-900 text-[13px] font-bold">{news.source}</span>
                          <span className="text-slate-300 text-[10px]">•</span>
                          <span className="text-slate-400 text-[11px] font-medium">{new Date(news.pubDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                          
                          {/* 매칭 키워드 태그 추가 */}
                          {news.matching_keywords && news.matching_keywords.length > 0 && (
                            <div className="flex items-center gap-1.5 ml-2">
                              {news.matching_keywords.slice(0, 3).map((kw, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md font-medium border border-slate-200/50">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <span className="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-primary ml-1 opacity-0 group-hover:opacity-100 transition-all">open_in_new</span>
                        </div>
                        <h4 className="text-slate-800 font-bold text-[15px] group-hover:text-primary transition-colors truncate">
                          {news.title}
                        </h4>
                      </div>
                      
                      <div className="pl-4">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="bg-primary/90 hover:bg-primary shadow-sm hover:shadow-md transition-all h-9 px-4 rounded-full text-[12px] font-bold whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/analysis?id=${news.id}`);
                          }}
                        >
                          심층 분석
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-8 border-t border-slate-100 flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`size-9 flex items-center justify-center rounded-full transition-all ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-primary'}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`size-9 flex items-center justify-center rounded-full text-[14px] font-bold transition-all ${
                          currentPage === i + 1 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`size-9 flex items-center justify-center rounded-full transition-all ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-primary'}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-100 mb-4">search_off</span>
              <p className="text-slate-400 font-medium">검색어를 입력해 주세요.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default SearchResultsPage
