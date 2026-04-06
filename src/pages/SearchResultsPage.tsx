import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  
  const [inputValue, setInputValue] = useState(query)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchData, setSearchData] = useState<NlpSearchData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredCitation, setHoveredCitation] = useState<string | null>(null)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
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

  const selectedArticle = selectedArticleId ? getArticleById(selectedArticleId) : null;
  const selectedTopic = selectedTopicId !== null ? searchData?.ai_summary_structured?.topics.find(t => t.id === selectedTopicId) : null;

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
    setSelectedArticleId(null)
    setSelectedTopicId(null)
  }, [query])

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }

  const toggleSelectArticle = (id: string, topicId: number | null = null) => {
    if (topicId !== null) {
      // 토픽 선택 시
      if (selectedTopicId === topicId) {
        setSelectedTopicId(null);
        setSelectedArticleId(null);
      } else {
        setSelectedTopicId(topicId);
        setSelectedArticleId(id);
      }
    } else {
      // 기사 개별 선택 시
      if (selectedArticleId === id && selectedTopicId === null) {
        setSelectedArticleId(null);
      } else {
        setSelectedArticleId(id);
        setSelectedTopicId(null);
      }
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
        {/* Search Input Area */}
        <div className="bg-white border-b border-slate-100 pt-6 md:pt-8 pb-4 md:pb-6 sticky top-0 z-30">
          <div className="max-w-[1400px] mx-auto px-6">
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
                        검색하신 <strong className="text-primary font-bold underline underline-offset-4 decoration-primary/30 text-[17px]">'{query}'</strong>과 관련하여, 가장 많이 거론되는 뉴스들을 모았습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI 뉴스 요약 (구조화된 카드 형식) */}
              <div className="max-w-6xl mx-auto mb-6 text-left">
                <div className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 relative overflow-visible">
                  {searchData.ai_summary_structured ? (
                    <div className="space-y-4">
                      <div className="text-slate-800 text-[16px] md:text-[17px] font-bold leading-relaxed mb-3 text-left">
                        {searchData.ai_summary_structured.intro}
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {searchData.ai_summary_structured.topics.map((topic) => {
                          const primaryArticleId = topic.related_articles[0];
                          const isTopicSelected = selectedTopicId === topic.id;
                          
                          return (
                            <div key={topic.id} className="relative pl-12 group/topic text-left">
                              {/* 좌측 큰 번호판을 체크 버튼으로 교체 */}
                              <div 
                                className={`absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-sm ${
                                  isTopicSelected ? 'bg-primary text-white border-primary border-4' : 'bg-slate-50 text-slate-300 border-slate-200 hover:border-primary/50 hover:text-primary/50'
                                }`}
                                onClick={() => primaryArticleId && toggleSelectArticle(primaryArticleId, topic.id)}
                                title="이 토픽과 관련된 뉴스 분석하기"
                              >
                                <span className="material-symbols-outlined text-[18px] font-bold">
                                  {isTopicSelected ? 'check' : 'radio_button_unchecked'}
                                </span>
                              </div>
                              
                              <h3 
                                className={`text-[17px] font-bold mb-1.5 transition-colors cursor-pointer inline-block ${
                                  isTopicSelected ? 'text-primary' : 'text-slate-900 group-hover/topic:text-primary/80'
                                }`}
                                onClick={() => primaryArticleId && toggleSelectArticle(primaryArticleId, topic.id)}
                              >
                                {topic.title}
                              </h3>
                              <p className="text-slate-600 text-[16px] leading-[1.7] mb-1 text-justify">
                                {topic.content}
                              </p>
                              
                              <div className="flex flex-wrap gap-2 pt-0.5">
                                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 mr-1">관련 근거:</span>
                                {topic.related_articles.map((articleId) => {
                                  const article = getArticleById(articleId);
                                  if (article) {
                                    return (
                                      <button
                                        key={articleId}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(article.link, '_blank');
                                        }}
                                        onMouseEnter={() => setHoveredCitation(articleId)}
                                        onMouseLeave={() => setHoveredCitation(null)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white border border-slate-200 text-slate-500 hover:border-primary/40 hover:text-primary transition-all shadow-sm"
                                        title={`${article.source} 원문 기사 읽기`}
                                      >
                                        {article.source}
                                        <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                                      </button>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none text-left">
                      {searchData.ai_summary.split(/\n+/).filter(p => p.trim() !== '').map((paragraph, pIdx) => (
                        <p key={pIdx} className="text-slate-700 text-[16px] leading-[1.8] mb-6 text-justify">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 하단 섹션 안내 박스 복구 */}
              <div className="max-w-6xl mx-auto border-t-4 border-double border-slate-100 pt-8 mb-6 text-left">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 text-left">찾으시는 뉴스가 없으신가요?</h3>
                    <p className="text-slate-500 text-sm text-left">아래의 전체 뉴스 목록에서 기사 우측의 <span className="text-primary font-bold">체크 버튼</span>을 눌러 관심 있는 기사를 선택해 보세요.</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined">arrow_downward</span>
                    목록 확인하기
                  </div>
                </div>
              </div>

              <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between px-2 pt-6">
                <SectionHeader icon="list_alt" title="전체 뉴스 목록" titleSize="sm" />
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[13px] font-medium tracking-tight">총 {searchData.total_results}건의 뉴스</span>
                </div>
              </div>

              {/* ARTICLE LIST */}
              <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0">
                    {currentArticles.map((news: NlpSearchArticle) => {
                    const isSelected = selectedArticleId === news.id && selectedTopicId === null;
                    return (
                      <div 
                        key={news.id} 
                        className={`relative py-6 transition-all group px-8 border-b border-slate-100 md:odd:border-r flex items-center justify-between hover:bg-slate-50 ${isSelected ? 'bg-orange-50/20' : ''}`}
                      >
                        <div className="flex-1 min-w-0 pr-16">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-slate-900 text-[13px] font-bold">{news.source}</span>
                            <span className="text-slate-300 text-[10px]">•</span>
                            <span className="text-slate-400 text-[11px] font-medium">{new Date(news.pubDate).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <h4 
                            className="text-slate-800 font-bold text-[16px] truncate cursor-pointer hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                            onClick={() => window.open(news.link, '_blank')}
                          >
                            {news.title}
                          </h4>
                        </div>
                        
                        {/* 체크 버튼 (우측 세로 중앙) */}
                        <div 
                          className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer group/check"
                          onClick={() => toggleSelectArticle(news.id)}
                        >
                          <span className={`material-symbols-outlined text-[26px] transition-all font-bold ${
                            isSelected ? 'text-primary scale-110' : 'text-slate-200 group-hover/check:text-primary/40'
                          }`}>
                            {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-8 border-t border-slate-100 flex items-center justify-center gap-2">
                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="size-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                      <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`size-9 flex items-center justify-center rounded-full text-[14px] font-bold transition-all ${currentPage === i + 1 ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-50'}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="size-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 disabled:opacity-30">
                      <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                  </div>
                )}
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

      {/* 하단 고정 액션 바 (상시 노출 및 선택 유도) */}
      <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-[#FEF6F1]/95 backdrop-blur-xl border-t border-orange-100/30 px-8 py-5 flex items-center justify-between shadow-[0_-15px_50px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4 flex-1 min-w-0 mr-10">
          <div className={`size-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${(selectedArticle || selectedTopic) ? 'bg-orange-100' : 'bg-orange-200/20 animate-pulse'}`}>
            <span className={`material-symbols-outlined text-[24px] ${(selectedArticle || selectedTopic) ? 'text-primary' : 'text-primary'}`}>
              {(selectedArticle || selectedTopic) ? 'check_circle' : 'touch_app'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            {(selectedArticle || selectedTopic) ? (
              <>
                <span className="text-[11px] font-extrabold text-primary uppercase tracking-widest mb-0.5 animate-in fade-in slide-in-from-left duration-300">
                  {selectedTopic ? '선택된 분석 주제' : '선택된 분석 대상'}
                </span>
                <h3 className="text-slate-900 font-bold text-[16px] truncate max-w-3xl animate-in fade-in slide-in-from-left duration-500">
                  {selectedTopic ? selectedTopic.title : selectedArticle?.title}
                </h3>
              </>
            ) : (
              <h3 className="text-slate-800 font-bold text-[18px] md:text-[20px] tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
                분석할 기사의 <span className="text-primary underline underline-offset-8 decoration-primary/30">체크 버튼</span>을 눌러주세요!
              </h3>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedArticle && (
            <Button 
              variant="outline" 
              className="px-6 rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 transition-all font-bold h-12 animate-in fade-in duration-300"
              onClick={() => {
                setSelectedArticleId(null);
                setSelectedTopicId(null);
              }}
            >
              선택 해제
            </Button>
          )}
          <Button 
            disabled={!selectedArticle}
            className={`px-10 rounded-xl font-bold h-12 transition-all shadow-lg ${
              selectedArticle 
              ? 'bg-primary hover:bg-primary-dark shadow-primary/20 scale-105' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
            onClick={() => selectedArticle && navigate(`/analysis?id=${selectedArticleId}`)}
          >
            심층 분석 하기
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default SearchResultsPage
