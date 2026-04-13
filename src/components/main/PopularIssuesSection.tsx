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
    <div className="w-full min-w-0 md:border-l border-slate-100 md:pl-8 flex flex-col text-left self-stretch transition-all duration-300">
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between h-8 mb-4">
          <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight">
            언론사 공통으로 다루는 인기 뉴스에요
          </h2>
        </div>
        <div className="flex items-center gap-1.5 mb-3 text-[12px] text-slate-500 font-medium opacity-90">
          <span className="material-symbols-outlined text-[14px] text-primary">info</span>
          이곳은 이미 초안이 준비되어 있어요. 바로 편집을 시작하세요!
        </div>
        <div className="w-full h-px bg-slate-100 mb-6"></div>
        
      </div>

      <div className="flex flex-col">
        <div className="divide-y divide-slate-100">
          {loading || !dailyIssues ? (
            <div className="animate-pulse space-y-6">
              <div className="h-[240px] bg-slate-100 rounded-xl w-full" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-slate-50 rounded w-full" />
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

              const topIssue = issuesForDate[0];
              
              return (
                <>
                  <div 
                    className="shadow-premium-card p-4 group cursor-pointer w-full mb-6" 
                    onClick={() => onNavigateToAnalysis(topIssue.id)}
                  >
                    <div className="border-t-[3px] border-primary mb-4"></div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-primary flex items-center gap-1 tracking-tight">통합 인기 1위</h4>
                    </div>
                    <div className="pb-4 pt-1 group cursor-pointer border-b border-slate-100">
                      <div className="relative w-full aspect-[21/9] mb-3 overflow-hidden rounded-xl bg-slate-100">
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
                        <div className="absolute top-2 left-2 size-7 bg-primary text-white flex items-center justify-center font-black rank-number rounded shadow-glow z-10">1</div>
                        <div className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-primary/20 rounded-lg flex items-center shadow-sm z-10">
                          <span className="text-[10px] font-bold text-slate-700">AI 초안 작성 완료</span>
                        </div>
                      </div>
                      <h5 className="text-[15px] font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {topIssue.name}
                      </h5>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-slate-50 bg-white">
                    {issuesForDate.slice(1, 10).map((issue) => (
                      <div 
                        key={issue.id} 
                        className="py-2.5 group cursor-pointer flex gap-4 items-baseline" 
                        onClick={() => onNavigateToAnalysis(issue.id)}
                      >
                        <span className="rank-number text-xs font-bold text-slate-400 w-4 text-center shrink-0">{issue.rank}</span>
                        <p className="text-[14px] font-medium text-slate-700 truncate flex-1 group-hover:text-primary transition-colors">
                          {issue.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()
          )}
        </div>
      </div>

      <div className="mt-24 bg-[#FFFBF7] p-5 rounded-[32px] border border-orange-100/50 flex flex-col items-center shadow-[0_15px_40px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden md:sticky top-[200px] z-20 transition-all duration-300">
        {/* 장식용 배경 요소 */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mb-12 blur-3xl"></div>

        <div className="flex flex-col items-center mb-4 text-center px-4 relative z-10">
          <span className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary rounded-full mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[14px] font-bold">visibility</span>
          </span>
          <p className="text-[18px] font-bold text-slate-800 mb-1 tracking-tighter">
            찾는 뉴스가 없으신가요?
          </p>
          <p className="text-[12px] font-normal text-slate-400">원하는 키워드를 입력하시면 관련 뉴스를 찾아드릴게요</p>
        </div>
        
        <div className="relative w-full max-w-[460px] group mb-4 relative z-10">
          <input
            id="search-input-content"
            className="w-full pl-7 pr-16 py-3.5 border-2 border-slate-300 rounded-full focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary/40 transition-all bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] placeholder:text-slate-400 font-medium text-[14px] text-slate-700"
            placeholder="직접 검색해보세요!"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInternalSearch()}
          />
          <button
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[36px] h-[36px] bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-105 active:scale-95"
            onClick={handleInternalSearch}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] font-bold">search</span>
          </button>
        </div>

        {/* 최근 검색어 태그 */}
        <div className="flex items-center gap-2 flex-wrap justify-center max-w-[400px]">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">최근 검색</span>
          {recentSearches.length > 0 ? (
            recentSearches.map((term, i) => (
              <div
                key={i}
                onClick={() => handleHistoryClick(term)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-primary/30 group transition-all"
              >
                <span className="text-[11px] font-medium text-slate-600 group-hover:text-primary">{term}</span>
                <button
                  onClick={(e) => removeSearch(e, term)}
                  className="flex items-center text-slate-300 hover:text-rose-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </div>
            ))
          ) : (
            <span className="text-[11px] font-medium text-slate-300 italic">기록 없음</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default PopularIssuesSection
