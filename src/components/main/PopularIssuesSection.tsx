import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WeeklyCalendar from './WeeklyCalendar'
import MonthlyCalendar from './MonthlyCalendar'
import { DailyIssuesResponse } from '../../types/issues'

interface PopularIssuesSectionProps {
  loading: boolean
  dailyIssues: DailyIssuesResponse | null
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
  loading, dailyIssues, currentPage, setCurrentPage, topImageIndex, selectedDate, onDateChange, onNavigateToAnalysis,
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

  const removeSearch = (e: React.MouseEvent, query: string) => {
    e.stopPropagation()
    const newSearches = recentSearches.filter(s => s !== query)
    setRecentSearches(newSearches)
    localStorage.setItem('recent_searches', JSON.stringify(newSearches))
  }

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    saveSearch(query)
    setTimeout(() => onSearch(), 10)
  }

  return (
    <div className="w-full h-full min-w-0 md:border-r border-slate-100 md:pr-2 flex flex-col text-left self-stretch transition-all duration-300">
      <div className="flex flex-col mb-0">
        <div className="flex items-center justify-between h-9 mb-1.5 mt-1">
          <h2 className="text-slate-800 text-base font-bold tracking-tight">
            언론사 공통으로 다루는 인기 뉴스에요
          </h2>
        </div>
        <div className="flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 font-medium opacity-90">
          <span className="material-symbols-outlined text-[14px] text-primary">info</span>
          이곳은 이미 초안이 준비되어 있어요. 바로 편집을 시작하세요!
        </div>
        <div className="w-full h-px bg-slate-100 mb-0"></div>
        
      </div>

      <div className="flex flex-col">
        <div className="divide-y divide-slate-100">
          {loading || !dailyIssues ? (
            <div className="space-y-10">
              {/* 1위 스켈레톤 */}
              <div className="shadow-premium-card py-4 -mx-1 max-w-[500px] w-full">
                <div className="h-0.5 bg-slate-100 mb-6 w-full" />
                <div className="animate-pulse space-y-4">
                  <div className="w-[120px] h-6 bg-slate-200 rounded-md mb-4" />
                  <div className="w-full aspect-video bg-slate-200 rounded-xl" />
                  <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                </div>
              </div>

              {/* 리스트 스켈레톤 */}
              <div className="grid grid-cols-1 gap-y-8 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-3">
                    <div className="w-[300px] aspect-video bg-slate-100 rounded-xl" />
                    <div className="w-[200px] h-4 bg-slate-50 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            (() => {
              const year = selectedDate.getFullYear();
              const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
              const day = String(selectedDate.getDate()).padStart(2, '0');
              const dateStr = `${year}-${month}-${day}`;
              
              const issuesForDate = dailyIssues?.data?.[dateStr] || [];
              
              if (issuesForDate.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                    <span className="material-symbols-outlined text-4xl">event_busy</span>
                    <p className="text-sm font-medium">선택한 날짜({dateStr})에 대한 이슈가 없습니다.</p>
                  </div>
                );
              }

              const ITEMS_PER_PAGE = 10;
              const totalPages = Math.ceil(issuesForDate.length / ITEMS_PER_PAGE);
              const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
              const endIndex = startIndex + ITEMS_PER_PAGE;
              const currentIssues = issuesForDate.slice(startIndex, endIndex);

              const isFirstPage = currentPage === 1;
              const topIssue = isFirstPage && currentIssues.length > 0 ? currentIssues[0] : null;
              const listIssues = isFirstPage ? currentIssues.slice(1) : currentIssues;

              return (
                <div className="flex flex-col justify-between min-h-[680px]">
                  <div>
                    {topIssue ? (
                      <div 
                        className="shadow-premium-card py-4 group cursor-pointer max-w-[500px] w-full mb-1 -mx-1" 
                        onClick={() => onNavigateToAnalysis(topIssue.id)}
                      >
                        <div className="border-t-[3px] border-primary mb-4 max-w-[500px] w-full"></div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-primary flex items-center gap-1 tracking-tight">통합 인기 1위</h4>
                        </div>
                        <div className="pb-4 pt-1 group cursor-pointer border-b border-slate-100">
                          <div className="relative max-w-[500px] w-full aspect-video mb-3 overflow-hidden rounded-xl bg-slate-100 shadow-sm border border-slate-200/50">
                            {topIssue.image_urls?.map((url, imgIdx) => (
                              <img 
                                key={`${topIssue.id}-${imgIdx}`}
                                alt={topIssue.name} 
                                className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out ${
                                  imgIdx === topImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                }`} 
                                src={url || DEFAULT_IMAGE}
                                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                              />
                            ))}
                            {(topIssue.image_urls?.length === 0 || !topIssue.image_urls) && (
                              <img 
                                alt={topIssue.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                src={DEFAULT_IMAGE}
                              />
                            )}
                            <span 
                              className="absolute bottom-1 left-2 font-black text-white/20 leading-none select-none z-20 pointer-events-none tracking-tighter text-[80px]" 
                              style={{ 
                                WebkitTextStroke: '2.5px rgba(255, 255, 255, 0.95)',
                                filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.8))'
                              }}
                            >
                              1
                            </span>
                            <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-lg flex items-center shadow-sm z-10">
                              <span className="text-[10px] font-bold text-slate-700">AI 초안 작성 완료</span>
                            </div>
                          </div>
                          <h5 className="text-[13px] font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {topIssue.name}
                          </h5>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full mb-1 -mx-1 pt-4">
                        <div className="border-t-[3px] border-primary mb-2 max-w-[500px] w-full"></div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-y-4 mt-4 pb-2 -mx-1">
                      {listIssues.map((issue) => (
                        <div 
                          key={issue.id} 
                          className="group cursor-pointer flex flex-row gap-5 p-2 rounded-2xl hover:bg-slate-50/50 transition-all duration-300" 
                          onClick={() => onNavigateToAnalysis(issue.id)}
                        >
                          {/* 좌측: 이미지 + 랭킹 오버레이 */}
                          <div className="relative shrink-0">
                            {/* 썸네일 (300px) */}
                            <div className="relative z-10 w-[300px] aspect-video rounded-xl overflow-hidden shadow-sm border border-slate-200/50 group-hover:shadow-md transition-all">
                              <img 
                                alt={issue.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                src={(issue.image_urls && issue.image_urls.length > 0) ? issue.image_urls[0] : DEFAULT_IMAGE}
                                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE }}
                              />
                            </div>

                            {/* 순위 숫자 스타일 */}
                            <span 
                              className={`absolute bottom-[-5px] left-[-15px] font-black text-white/20 leading-none select-none z-20 pointer-events-none transition-all duration-300 group-hover:-translate-y-1 tracking-tighter ${
                                issue.rank >= 10 ? 'text-[44px] tracking-[-0.05em]' : 'text-[54px]'
                              }`} 
                              style={{ 
                                WebkitTextStroke: '2px rgba(255, 255, 255, 0.95)',
                                filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.8))'
                              }}
                            >
                              {issue.rank}
                            </span>
                          </div>
                          
                          {/* 우측: 텍스트 영역 (제목 + 수집 기사 수) */}
                          <div className="flex-1 min-w-0 py-1 flex flex-col justify-center gap-2">
                            <h5 className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              {issue.name}
                            </h5>
                            
                            {/* 수집 기사 수 뱃지 */}
                            <div className="flex items-center gap-1.5">
                              <div className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200/50 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px] text-slate-400">description</span>
                                <span className="text-[11px] font-bold text-slate-500">
                                  수집 기사 수 <span className="text-primary">24건</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-1 mt-6">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`size-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all ${
                                  currentPage === pageNum 
                                    ? 'bg-primary text-white shadow-sm' 
                                    : 'hover:bg-slate-100 text-slate-500'
                                }`}
                              >
                                {pageNum}
                              </button>
                            )
                          } else if (
                            pageNum === currentPage - 2 ||
                            pageNum === currentPage + 2
                          ) {
                            return <span key={pageNum} className="text-slate-300 px-1 text-[12px]">...</span>
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
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
  )
}

export default PopularIssuesSection
