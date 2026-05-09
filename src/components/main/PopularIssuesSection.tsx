import React, { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DailyIssuesResponse } from '../../types/issues'
import FigmaHeaderCalendar from './FigmaHeaderCalendar'

interface PopularIssuesSectionProps {
  loading: boolean
  dailyIssues: DailyIssuesResponse | null
  activeIssueType: 'politics' | 'editorial'
  currentPage: number
  setCurrentPage: (page: number) => void
  topImageIndex: number
  selectedDate: Date
  onDateChange: (date: Date) => void
  onNavigateToAnalysis: (id: number) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: () => void
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const PopularIssuesSection = ({
  loading, dailyIssues, activeIssueType, currentPage, setCurrentPage, topImageIndex, selectedDate, onDateChange, onNavigateToAnalysis,
  searchQuery, setSearchQuery, onSearch
}: PopularIssuesSectionProps) => {
  const [recentSearches, setRecentSearches] = React.useState<string[]>([])

  // 💡 초기 로드 시 localStorage에서 최근 검색어 불러오기
  React.useEffect(() => {
    const saved = localStorage.getItem('recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent searches', e)
      }
    }
  }, [])

  const saveSearch = (query: string) => {
    if (!query.trim()) return
    const filtered = recentSearches.filter(s => s !== query.trim())
    const newSearches = [query.trim(), ...filtered].slice(0, 5)
    setRecentSearches(newSearches)
    localStorage.setItem('recent_searches', JSON.stringify(newSearches))
  }

  const handleInternalSearch = () => {
    saveSearch(searchQuery)
    onSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInternalSearch()
    }
  }

  return (
    <div className="w-full h-full min-w-0 md:border-r border-slate-100 md:pr-2 flex flex-col text-left self-stretch transition-all duration-300">
      <div className="flex flex-col mb-0">
        {/* 헤더: 타이틀 + 달력(중앙) + 검색바(우측) */}
        <div className="flex items-center justify-between w-full h-14 mb-2 mt-1 gap-4">
          <h2 className="text-slate-800 text-[15px] xl:text-[16px] font-semibold tracking-tight shrink-0 whitespace-nowrap">
            언론사 공통으로 다루는 인기 뉴스에요
          </h2>

          {/* 중앙: 달력 */}
          <div className="flex-1 flex justify-center scale-90">
            <FigmaHeaderCalendar 
              selectedDate={selectedDate}
              onDateChange={onDateChange}
            />
          </div>

          {/* 우측: 검색바 (길이 축소) */}
          <div className="w-[280px] shrink-0 relative group">
            <input
              className="w-full pl-9 pr-10 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all bg-white shadow-sm placeholder:text-slate-400 font-medium text-[12px] text-slate-700"
              placeholder="뉴스 검색..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <button
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/5 rounded transition-colors"
              onClick={handleInternalSearch}
            >
              GO
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 font-medium opacity-90">
          <span className="material-symbols-outlined text-[14px] text-primary">info</span>
          이곳은 이미 초안이 준비되어 있어요. 바로 편집을 시작하세요!
        </div>
        <div className="w-full h-px bg-slate-100 mb-0"></div>
      </div>

      <div className="flex flex-col mt-4">
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="space-y-10">
              <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-video bg-slate-100 rounded-2xl" />
                ))}
              </div>
            </div>
          ) : !dailyIssues ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-3">
              <span className="material-symbols-outlined text-5xl">wifi_off</span>
              <p className="text-sm font-medium">이슈 데이터를 불러올 수 없습니다.</p>
            </div>
          ) : (
            (() => {
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const day = String(selectedDate.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;
              
              const issuesForDate = dailyIssues?.data?.[dateStr] || [];
              const filteredIssues = issuesForDate.filter(issue => issue.issue_type === activeIssueType);
              
              if (filteredIssues.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                    <span className="material-symbols-outlined text-4xl">event_busy</span>
                    <p className="text-sm font-medium">선택한 날짜에 대한 이슈가 없습니다.</p>
                  </div>
                );
              }

              const ITEMS_PER_PAGE = 10;
              const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const currentIssues = filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

              return (
                <div className="flex flex-col justify-between min-h-[600px]">
                  <div>
                    {/* 상단 주황색 포인트 구분선 */}
                    <div className="border-t-[3px] border-primary w-full mb-4"></div>

                    {/* 모든 이슈 통합 그리드 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10 -mx-1">
                      {currentIssues.map((issue, idx) => {
                        const globalRank = startIndex + idx + 1;
                        return (
                          <div 
                            key={issue.id} 
                            className="group cursor-pointer flex flex-col gap-3 transition-all duration-300"
                            onClick={() => onNavigateToAnalysis(issue.id)}
                          >
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 bg-slate-50 group-hover:shadow-md group-hover:border-primary/20 transition-all">
                              <img 
                                alt={issue.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                src={(issue.image_urls && issue.image_urls.length > 0) ? issue.image_urls[0] : DEFAULT_IMAGE}
                                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                              />
                              {activeIssueType === 'politics' && (
                                <div className="absolute top-0 left-0 p-3 z-20">
                                  <span 
                                    className="font-black text-white leading-none select-none tracking-tighter text-[32px] xl:text-[40px]" 
                                    style={{ 
                                      WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.9)',
                                      filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.5))',
                                      opacity: 0.85
                                    }}
                                  >
                                    {globalRank}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col gap-1 px-1">
                              <h6 className="text-[14px] xl:text-[15px] font-semibold text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.2rem]">
                                {issue.name}
                              </h6>
                              <div className="flex flex-col gap-1 mt-0.5 pt-1.5 border-t border-slate-50">
                                {[
                                  { title: `${issue.name} 관련 긴급 뉴스...`, press: '연합뉴스' },
                                  { title: `실시간 이슈 리포트: ${issue.name}`, press: 'KBS' },
                                  { title: `주요 언론사별 분석 데이터 요약`, press: 'MBC' }
                                ].map((art, artIdx) => (
                                  <div key={artIdx} className="flex items-center gap-2 group/art overflow-hidden py-0.5">
                                    <span className="shrink-0 text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 group-hover/art:border-primary/20 group-hover/art:text-primary transition-colors">
                                      {art.press}
                                    </span>
                                    <p className="text-[11px] text-slate-600 font-medium truncate group-hover/art:text-primary transition-colors">
                                      {art.title}
                                    </p>
                                  </div>
                                ))}
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-[10px] text-slate-400 font-bold">기사 {issue.article_count || 0}건</span>
                                  <span className="material-symbols-outlined text-[14px] text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-1 mt-12 pb-4">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          if (
                            pageNum === 1 || pageNum === totalPages || 
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`size-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                                  currentPage === pageNum ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-slate-500'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                            return <span key={pageNum} className="text-slate-300 px-1 text-[12px]">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularIssuesSection;
