import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { searchIssues, searchNewsList } from '../mocks/searchData'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import Breadcrumb from '../components/ui/Breadcrumb'

const SearchResultsPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [inputValue, setInputValue] = useState(query)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSearch = () => {
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`)
    }
  }

  return (
    <Layout variant="white" activeStep={1} hideFooter>
        <Breadcrumb items={[`'${query}' 검색 결과`]} />

        <section className="flex-1 overflow-y-auto custom-scrollbar animate-page-in min-h-0">
          <div className="bg-white border-b border-slate-100 pt-6 md:pt-8 pb-4 md:pb-6">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="flex flex-col w-full max-w-4xl mx-auto md:px-0">
                <div className="max-w-4xl w-full relative mx-auto">
                  <input 
                    className="w-full h-12 md:h-14 pl-8 pr-16 bg-slate-50 border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base font-medium shadow-sm" 
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
            <div className="max-w-7xl mx-auto mb-6 text-left">
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-orange-50/50 border border-primary/10 text-left">
                <span className="material-symbols-outlined text-primary text-2xl mt-0.5">info</span>
                <p className="text-slate-700 text-base leading-relaxed">
                  검색하신 <strong className="text-primary font-black underline underline-offset-4 decoration-primary/30 text-lg">'{query}'</strong>과 관련하여, 가장 많이 거론되는 <strong className="text-primary font-black">5가지 이슈</strong>입니다.
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start mb-16 px-4 md:px-0">
              {searchIssues.map(issue => (
                <button 
                  key={issue.id} 
                  onClick={() => navigate('/analysis')}
                  className="flex flex-col text-left p-6 rounded-2xl border border-slate-200 bg-white hover:border-primary/50 hover:shadow-xl transition-all group relative overflow-hidden h-full"
                >
                  <div className={`absolute inset-0 ${issue.pattern} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                  <div className="relative z-10 flex flex-col h-full">
                    <h4 className="text-slate-900 font-bold text-base leading-snug mb-4 group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: issue.title }}></h4>
                    <div className="mb-4">
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-4">
                        {issue.description}
                      </p>
                    </div>
                    <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                      {issue.points.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="size-1 rounded-full bg-primary mt-1.5 shrink-0"></span>
                          <p className="text-[11px] text-slate-500 font-medium">{point}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-3">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-slate-400 text-sm">bar_chart</span>
                        <span className="text-slate-500 text-[10px] font-bold">보도량 {issue.coverage}건</span>
                      </div>
                      <span className="text-primary text-[10px] font-bold group-hover:underline">자세히 보기 &gt;</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="max-w-7xl mx-auto border-t-4 border-double border-slate-100 pt-16 mb-8 text-left">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 text-left">찾으시는 이슈가 없다면?</h3>
                  <p className="text-slate-500 text-sm text-left">개별 기사 목록에서 검색하신 의도와 가장 유사한 기사를 선택해주세요.</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="material-symbols-outlined">arrow_downward</span>
                  직접 선택하기
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto text-left">
              <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs font-bold whitespace-nowrap">언론사 필터:</span>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="primary" size="sm" className="rounded-full">전체</Button>
                      {['한겨레', '경향신문', '조선일보', '동아일보', '연합뉴스'].map(media => (
                        <Button key={media} variant="outline" size="sm" className="rounded-full border-slate-200 text-slate-500">
                          {media}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                    <button className="px-3 py-1 text-xs font-bold bg-white text-slate-900 rounded shadow-sm">최신순</button>
                    <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">관련도순</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <SectionHeader 
                    icon="list_alt" 
                    title="개별 뉴스 목록"
                    titleSize="sm"
                  />
                  <div className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[13px] text-slate-400 font-medium">검색 결과 총 128건</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col h-[680px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 border-t border-slate-100/60 flex-1">
                  {(() => {
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const currentItems = searchNewsList.slice(startIndex, startIndex + itemsPerPage);
                    return currentItems.map(news => (
                      <div 
                        key={news.id} 
                        onClick={() => navigate('/analysis')}
                        className="py-3 hover:bg-slate-50 transition-all group cursor-pointer border-l-4 border-transparent hover:border-primary px-6 border-b border-r border-slate-100/60 md:last:border-r-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-slate-600 text-sm font-bold">{news.media}</span>
                              <span className="text-slate-300 text-[10px]">•</span>
                              <span className="text-slate-400 text-xs">{news.time}</span>
                            </div>
                            <h4 className="text-slate-800 font-bold text-base group-hover:text-primary transition-colors truncate">{news.title}</h4>
                          </div>
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* 페이지네이션 UI - mt-auto를 통해 하단 고정 */}
                <div className="mt-auto pt-10 mb-16 flex items-center justify-center gap-2">
                  {(() => {
                    const totalPages = Math.ceil(searchNewsList.length / itemsPerPage);
                    return (
                      <>
                        <button 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className={`size-9 flex items-center justify-center rounded-xl transition-all ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-primary'}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => {
                              setCurrentPage(i + 1);
                              // 페이지 이동 시 상단으로 스크롤 (원할 경우 추가)
                              document.querySelector('section')?.scrollTo({ top: 300, behavior: 'smooth' });
                            }}
                            className={`size-9 flex items-center justify-center rounded-xl text-[14px] font-bold transition-all ${
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
                          className={`size-9 flex items-center justify-center rounded-xl transition-all ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-100 hover:text-primary'}`}
                        >
                          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>
    </Layout>
  )
}

export default SearchResultsPage
