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
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'

const PopularIssuesSection = ({
  loading, dailyIssues, currentPage, setCurrentPage, topImageIndex, selectedDate, onDateChange, onNavigateToAnalysis
}: PopularIssuesSectionProps) => {
  return (
    <div className="w-full md:w-1/2 min-w-0 border-l border-slate-100 pl-4 flex flex-col text-left">
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between h-8 mb-4">
          <h2 className="text-slate-800 text-xl font-bold tracking-tight section-highlight">
            언론사 공통으로 다루는 인기 뉴스에요
          </h2>
        </div>

        <div className="flex items-center gap-1.5 mb-3 text-[12px] text-slate-500 font-medium opacity-90">
          <span className="material-symbols-outlined text-[14px] text-primary">info</span>
          이곳의 기사들은 이미 초안이 준비되어 있어요. 바로 편집을 시작해 보세요!
        </div>
        <div className="w-full h-px bg-slate-100 mb-2"></div>
        
        <div className="mt-auto pb-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-full w-full border border-slate-200/50 shadow-inner">
            <div className="flex-1 py-2 rounded-full text-[14px] font-bold bg-white text-slate-900 shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-slate-100 text-center" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
              실시간 통합 순위
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
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

      <div className="mt-8">
        {/* 필터 및 매체 설정 버튼 제거됨 */}
      </div>
    </div>
  )
}

export default PopularIssuesSection
